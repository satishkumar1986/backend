import { Routes } from "@angular/router";

export const contentRoutes: Routes = [
    { path: 'dashboard', loadChildren: () => import('../../components/dashboard/dashboard.module').then(md => md.DashboardModule) },
    { path: 'products', loadChildren: () => import('../../components/products/products.module').then(md => md.ProductsModule) },
    { path: 'sales', loadChildren: () => import('../../components/sales/sales.module').then(md => md.SalesModule) },
    { path: 'masters', loadChildren: () => import('../../components/master/master.module').then(md => md.MasterModule) },
    { path: 'users', loadChildren: () => import('../../components/users/users.module').then(md => md.UsersModule) },
    { path: 'reports', loadChildren: () => import('../../components/reports/reports.module').then(md => md.ReportsModule) },
    { path: 'settings', loadChildren: () => import('../../components/settings/settings.module').then(md => md.SettingsModule) },
    { path: 'invoice', loadChildren: () => import('../../components/invoice/invoice.module').then(md => md.InvoiceModule) }
];