export default function MetaFacebook({ facebook }: { facebook: string }) {
    return (
        <>
            <meta property="fb:app_id" content={facebook} />
        </>
    );
}
