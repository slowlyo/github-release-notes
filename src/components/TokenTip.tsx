export const TokenTip = () => {
    return (
        <>
            <a href="https://github.com/settings/tokens/new?description=GitHub%20Changelog%20Generator%20Token"
               className="text-blue-500"
               target="_blank">
                👉 Generate a token here
            </a>
            <div>
                you only need "repo" scope for private repositories
            </div>
        </>
    )
}
