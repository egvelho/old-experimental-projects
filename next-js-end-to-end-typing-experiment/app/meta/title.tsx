export default function MetaTitle({ title }: { title: string }) {
    return (
        <>
            <title>{title}</title>
            <meta key="og-title" property="og:title" content={title} />
            <meta key="twitter-title" name="twitter:title" content={title} />
            <meta name="apple-mobile-web-app-title" content={title} />
        </>
    );
}
