export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <main className="w-full min-h-screen">{children}</main>;
}
