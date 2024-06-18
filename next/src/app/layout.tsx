"use client";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from './(DashboardLayout)/config/web3'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationProvider } from './(DashboardLayout)/context/Notification'
import { DialogProvider } from './(DashboardLayout)/context/Dialog'

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
        <NotificationProvider>
        <DialogProvider>
            <ThemeProvider theme={baselightTheme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              {children} 
            </ThemeProvider>  
            </DialogProvider>
            </NotificationProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
