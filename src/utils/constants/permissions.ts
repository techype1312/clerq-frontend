import { RoleEnum } from '@/utils/constants/roles';
import { PermissionType } from '@/types/permissions';

export interface DefaultUserPermissions {
  [RoleEnum.owner]: PermissionType;
  [RoleEnum.admin]: PermissionType;
  [RoleEnum.accountant]: PermissionType;
  [RoleEnum.agency]: PermissionType;
  [RoleEnum.manager]: PermissionType;
  [RoleEnum.cpa]: PermissionType;
  [RoleEnum.lawyer]: PermissionType;
}

export const defaultUserPermissions: DefaultUserPermissions = {
  3: {
    routes: {
      dashboard: true,
      transactions: true,
      incomeStatement: true,
      balanceSheet: true,
      accounts: true,
      teams: true,
      documents: true,
      controls: true,
      myProfile: true,
      companyProfile: true,
      newCompany: true,
    },
    finance: {
      viewBookKeepings: true,
      viewFinance: true,
      manageTransactions: true,
      manageBankAccounts: true,
    },
    documents: {
      uploadDocument: true,
      generateDocument: true,
      downloadDocument: true,
      shareDocument: true,
    },
    reports: {
      downloadTransactionReports: true,
      downloadSheetReports: true,
      downloadStatementReports: true,
      downloadFinanceReports: true,
    },
    companySettings: {
      bookMeeting: true,
      chatSupport: true,
      manageCompanyProfile: true,
      updateControls: true,
    },
    teams: {
      manageTeam: true,
      manageInvite: true,
    },
  },
  4: {
    routes: {
      dashboard: true,
      transactions: true,
      incomeStatement: true,
      balanceSheet: true,
      accounts: true,
      teams: true,
      documents: true,
      controls: true,
      myProfile: true,
      companyProfile: true,
      newCompany: true,
    },
    finance: {
      viewBookKeepings: true,
      viewFinance: true,
      manageTransactions: true,
      manageBankAccounts: true,
    },
    documents: {
      uploadDocument: true,
      generateDocument: false, //Admin cannot generate documents for the company
      downloadDocument: true,
      shareDocument: false,
    },
    reports: {
      downloadTransactionReports: true,
      downloadSheetReports: true,
      downloadStatementReports: true,
      downloadFinanceReports: true,
    },
    companySettings: {
      bookMeeting: true,
      chatSupport: true,
      manageCompanyProfile: false,
      updateControls: true,
    },
    teams: {
      manageTeam: true,
      manageInvite: true,
    },
  },
  5: {
    routes: {
      dashboard: true,
      transactions: true,
      incomeStatement: true,
      balanceSheet: true,
      accounts: false,
      teams: false,
      documents: true,
      controls: false,
      myProfile: true,
      companyProfile: false,
      newCompany: false,
    },
    finance: {
      viewBookKeepings: true,
      viewFinance: true,
      manageTransactions: true,
      manageBankAccounts: false,
    },
    documents: {
      uploadDocument: true,
      generateDocument: true,
      downloadDocument: true,
      shareDocument: true,
    },
    reports: {
      downloadTransactionReports: true,
      downloadSheetReports: true,
      downloadStatementReports: true,
      downloadFinanceReports: true,
    },
    companySettings: {
      bookMeeting: true,
      chatSupport: true,
      manageCompanyProfile: false,
      updateControls: false,
    },
    teams: {
      manageTeam: false,
      manageInvite: false,
    },
  },
  8: {
    routes: {
      dashboard: false,
      transactions: false,
      incomeStatement: false,
      balanceSheet: false,
      accounts: false,
      teams: false,
      documents: false,
      controls: false,
      myProfile: true,
      companyProfile: false,
      newCompany: false,
    },
    finance: {
      viewBookKeepings: false,
      viewFinance: false,
      manageTransactions: false,
      manageBankAccounts: false,
    },
    documents: {
      uploadDocument: false,
      generateDocument: false,
      downloadDocument: false,
      shareDocument: false,
    },
    reports: {
      downloadTransactionReports: false,
      downloadSheetReports: false,
      downloadStatementReports: false,
      downloadFinanceReports: false,
    },
    companySettings: {
      bookMeeting: false,
      chatSupport: false,
      manageCompanyProfile: false,
      updateControls: false,
    },
    teams: {
      manageTeam: false,
      manageInvite: false,
    },
  },
  9: {
    routes: {
      dashboard: false,
      transactions: false,
      incomeStatement: false,
      balanceSheet: false,
      accounts: false,
      teams: false,
      documents: false,
      controls: false,
      myProfile: true,
      companyProfile: false,
      newCompany: false,
    },
    finance: {
      viewBookKeepings: false,
      viewFinance: false,
      manageTransactions: false,
      manageBankAccounts: false,
    },
    documents: {
      uploadDocument: false,
      generateDocument: false,
      downloadDocument: false,
      shareDocument: false,
    },
    reports: {
      downloadTransactionReports: false,
      downloadSheetReports: false,
      downloadStatementReports: false,
      downloadFinanceReports: false,
    },
    companySettings: {
      bookMeeting: false,
      chatSupport: false,
      manageCompanyProfile: false,
      updateControls: false,
    },
    teams: {
      manageTeam: false,
      manageInvite: false,
    },
  },
  6: {
    routes: {
      dashboard: false,
      transactions: false,
      incomeStatement: false,
      balanceSheet: false,
      accounts: false,
      teams: false,
      documents: false,
      controls: false,
      myProfile: true,
      companyProfile: false,
      newCompany: false,
    },
    finance: {
      viewBookKeepings: false,
      viewFinance: false,
      manageTransactions: false,
      manageBankAccounts: false,
    },
    documents: {
      uploadDocument: false,
      generateDocument: false,
      downloadDocument: false,
      shareDocument: false,
    },
    reports: {
      downloadTransactionReports: false,
      downloadSheetReports: false,
      downloadStatementReports: false,
      downloadFinanceReports: false,
    },
    companySettings: {
      bookMeeting: false,
      chatSupport: false,
      manageCompanyProfile: false,
      updateControls: false,
    },
    teams: {
      manageTeam: false,
      manageInvite: false,
    },
  },
  7: {
    routes: {
      dashboard: false,
      transactions: false,
      incomeStatement: false,
      balanceSheet: false,
      accounts: false,
      teams: false,
      documents: false,
      controls: false,
      myProfile: true,
      companyProfile: false,
      newCompany: false,
    },
    finance: {
      viewBookKeepings: false,
      viewFinance: false,
      manageTransactions: false,
      manageBankAccounts: false,
    },
    documents: {
      uploadDocument: false,
      generateDocument: false,
      downloadDocument: false,
      shareDocument: false,
    },
    reports: {
      downloadTransactionReports: false,
      downloadSheetReports: false,
      downloadStatementReports: false,
      downloadFinanceReports: false,
    },
    companySettings: {
      bookMeeting: false,
      chatSupport: false,
      manageCompanyProfile: false,
      updateControls: false,
    },
    teams: {
      manageTeam: false,
      manageInvite: false,
    },
  },
};
// defaultUserPermissions[RoleEnum.accountant].accounts.addBankAccounts;
