import { get, post } from "@/utils/fetch.util";

interface IQuerySort {
  orderBy?: string;
  order?: string;
}

interface IQuery {
  page?: number;
  limit?: number;
  sort?: IQuerySort[];
  filters?: Record<string, any>;
  amountFilter: any;
  dateFilter: any;
}

const generateLinkToken = async (payload: any) => {
  return post({ url: `/v1/banking/link-token`, data: payload }).then(
    (resp) => resp
  );
};

const exchangePublicToken = async (payload: any) => {
  return post({ url: `/v1/banking/institutions`, data: payload }).then(
    (resp) => resp
  );
};

const getBankAccounts = async (companyId: string) => {
  return get({ url: `/v1/banking/accounts/${companyId}` }).then((resp) => resp);
};

const getBankTransactions = async (companyId: string, query: IQuery) => {
  const {
    sort,
    page = 1,
    limit = 10,
    filters = {},
    amountFilter,
    dateFilter,
  } = query;
  let newFilters = {};
  if (amountFilter && Object.keys(amountFilter).length !== 0) {
    const amount = amountFilter.value;
    let amount_from = amount.split("-")[0];
    let amount_to = amount.split("-")[1];
    if (amount_from === amount) {
      amount_from = amount.split("+")[0];
      amount_to = null;
    }
    newFilters = {
      ...newFilters,
      ...(amount_from && amount_to
        ? { amount_from, amount_to }
        : amount_from
        ? { amount_from }
        : {}),
    };
  }

  if (filters && filters.find((filter: any) => filter.id === "category")) {
    const category = filters.filter(
      (filter: any) => filter.id === "category"
    )[0].value;
    newFilters = {
      ...newFilters,
      ...(category ? { category } : {}),
    };
  }

  if (
    filters &&
    filters.find((filter: any) => filter.id === "sub_categories")
  ) {
    const sub_categories = filters.filter(
      (filter: any) => filter.id === "sub_categories"
    )[0].value;
    newFilters = {
      ...newFilters,
      ...(sub_categories ? { sub_categories } : {}),
    };
  }

  if (dateFilter) {
    newFilters = {
      ...newFilters,
      ...(dateFilter && {
        created_at_from: dateFilter.from,
        created_at_to: dateFilter.to,
      }),
    };
  }

  return get({
    url: `/v1/banking/transactions/${companyId}?page=${page}&limit=${limit}&filters=${JSON.stringify(
      newFilters
    )}&sort=${JSON.stringify(sort)}`,
  }).then((resp) => resp);
};

const BankingApis = {
  generateLinkToken,
  exchangePublicToken,
  getBankTransactions,
  getBankAccounts,
};
export default BankingApis;
