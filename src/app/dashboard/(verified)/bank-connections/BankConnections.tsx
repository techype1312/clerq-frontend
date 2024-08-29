import AccountsTable from "@/components/dashboard/bankAccounts/AccountsTable";

const BankConnections = ({
  bankAccounts,
}: {
  bankAccounts: any;
}) => {
  return <AccountsTable accounts={bankAccounts} />;
};

export default BankConnections;
