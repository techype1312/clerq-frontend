export enum RoutesPermissionEnum {
    DASHBOARD = 'dashboard',
    TRANSACTIONS = 'transactions',
    INCOME_STATEMENT = 'incomeStatement',
    BALANCE_SHEET = 'balanceSheet',
    ACCOUNTS = 'accounts',
    TEAMS = 'teams',
    DOCUMENTS = 'documents',
    CONTROLS = 'controls',
    MY_PROFILE = 'myProfile',
    COMPANY_PROFILE = 'companyProfile',
    NEW_COMPANY = 'newCompany',
  }
  
  export enum FinancePermissionEnum {
    VIEW_BOOKKEEPINGS = 'viewBookKeepings',
    VIEW_FINANCE = 'viewFinance',
    MANAGE_TRANSACTIONS = 'manageTransactions',
    MANAGE_BANK_ACCOUNTS = 'manageBankAccounts',
  }
  
  export enum DocumentsPermissionEnum {
    UPLOAD_DOCUMENT = 'uploadDocument',
    GENERATE_DOCUMENT = 'generateDocument',
    DOWNLOAD_DOCUMENT = 'downloadDocument',
    SHARE_DOCUMENT = 'shareDocument',
  }
  
  export enum TeamsPermissionEnum {
    MANAGE_TEAM = 'manageTeam',
    MANAGE_INVITE = 'manageInvite',
  }
  
  export enum CompanySettingPermissionEnum {
    BOOK_MEETING = 'bookMeeting',
    CHAT_SUPPORT = 'chatSupport',
    MANAGE_COMPANY_PROFILE = 'manageCompanyProfile',
    UPDATE_CONTROLS = 'updateControls',
  }
  
  export enum ReportsPermissionEnum {
    DOWNLOAD_TRANSACTION_REPORTS = 'downloadTransactionReports',
    DOWNLOAD_SHEET_REPORTS = 'downloadSheetReports',
    DOWNLOAD_STATEMENT_REPORTS = 'downloadStatementReports',
    DOWNLOAD_FINANCE_REPORTS = 'downloadFinanceReports',
  }
  
  export type PermissionType = {
    routes: Record<RoutesPermissionEnum, boolean>;
    finance: Record<FinancePermissionEnum, boolean>;
    documents: Record<DocumentsPermissionEnum, boolean>;
    reports: Record<ReportsPermissionEnum, boolean>;
    companySettings: Record<CompanySettingPermissionEnum, boolean>;
    teams: Record<TeamsPermissionEnum, boolean>;
  };
  