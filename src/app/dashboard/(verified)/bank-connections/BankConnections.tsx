import AccountsTable from "@/components/dashboard/bankAccounts/AccountsTable";
const BankConnections = ({
  bankAccounts,
  companyId,
}: {
  bankAccounts: any;
  companyId: string;
}) => {
  return <AccountsTable accounts={bankAccounts} companyId={companyId} />;
};

export default BankConnections;
