export default function MetaPageUrl({ url }: { url: string }) {
    return (
        <>
            <meta key="og-url" property="og:url" content={url} />
            <link key="canonical" rel="canonical" href={url} />
        </>
    );
}
