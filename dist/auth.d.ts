export declare const handleLogin: (company: string, username: string, password: string, userType: string) => Promise<any>;
export declare const refreshToken: () => Promise<any>;
export declare const recoverPassword: (username: string, email: string, company: string) => Promise<any>;
export declare const getUserPermissions: () => Promise<any>;
