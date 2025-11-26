export default function AppLogo() {
    return (
        <span className="inline-flex items-center">
            <img
                src="/images/logo/logo-vermelho.png"
                alt="Tempo Necrologia"
                className="block h-8 w-auto dark:hidden"
            />
            <img
                src="/images/logo/logo-branco.png"
                alt="Tempo Necrologia"
                className="hidden h-8 w-auto dark:block"
            />
        </span>
    );
}
