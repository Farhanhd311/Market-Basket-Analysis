import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { AnalysisProvider } from "@/context/AnalysisContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MBA Ritel — Apriori",
  description: "Market Basket Analysis Ritel untuk Manajemen Rantai Pasok",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const removeAttr = (el) => {
                  if (el && el.removeAttribute) {
                    el.removeAttribute('bis_skin_checked');
                    el.removeAttribute('bis_register');
                  }
                };
                
                // Observe DOM to strip injected attributes instantly
                const observer = new MutationObserver((mutations) => {
                  for (const mutation of mutations) {
                    if (mutation.type === 'attributes' && (mutation.attributeName === 'bis_skin_checked' || mutation.attributeName === 'bis_register')) {
                      removeAttr(mutation.target);
                    }
                    if (mutation.type === 'childList') {
                      mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                          if (node.hasAttribute && (node.hasAttribute('bis_skin_checked') || node.hasAttribute('bis_register'))) {
                            removeAttr(node);
                          }
                          node.querySelectorAll('[bis_skin_checked], [bis_register]').forEach(removeAttr);
                        }
                      });
                    }
                  }
                });
                
                observer.observe(document.documentElement, {
                  childList: true,
                  subtree: true,
                  attributes: true,
                  attributeFilter: ['bis_skin_checked', 'bis_register']
                });
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} h-full bg-brand-bg text-brand-text flex overflow-hidden`} suppressHydrationWarning>
        <AnalysisProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Topbar */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
              <h2 className="text-xl font-bold text-brand-teal tracking-tight">
                MBA Ritel — Apriori
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-teal-50 text-brand-teal border border-brand-teal/20">
                  SCM Course Project
                </span>
              </div>
            </header>
            
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-8">
              {children}
            </main>
          </div>
        </AnalysisProvider>
      </body>
    </html>
  );
}
