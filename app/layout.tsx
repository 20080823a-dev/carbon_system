import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>
        {/* 使用 Providers 包覆整個應用的內容 */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}