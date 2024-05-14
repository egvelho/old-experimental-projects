export default function MetaTwitter({ twitter }: { twitter: string }) {
    return (
        <>
            <meta name="twitter:creator" content={twitter} />
            <meta name="twitter:site" content={twitter} />
        </>
    );
}
