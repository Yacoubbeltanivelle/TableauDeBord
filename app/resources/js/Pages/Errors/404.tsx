import { Head, Link } from "@inertiajs/react";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function Error404() {
    return (
        <>
            <Head title="Page non trouvée - 404" />

            <div
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#f5f5f7",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Header */}
                <header
                    style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 50,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(20px)",
                        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <div
                        style={{
                            maxWidth: "1200px",
                            margin: "0 auto",
                            padding: "16px 24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Link
                            href="/"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                textDecoration: "none",
                                color: "#1d1d1f",
                            }}
                        >
                            <div
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "8px",
                                    background:
                                        "linear-gradient(135deg, #1d1d1f 0%, #424245 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontWeight: "700",
                                    fontSize: "14px",
                                }}
                            >
                                T
                            </div>
                            <span
                                style={{ fontWeight: "600", fontSize: "15px" }}
                            >
                                TableauDeBord
                            </span>
                        </Link>
                    </div>
                </header>

                {/* Main content */}
                <main
                    style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "40px 24px",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "28px",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                            padding: "60px 48px",
                            maxWidth: "520px",
                            width: "100%",
                            textAlign: "center",
                        }}
                    >
                        {/* 404 Icon */}
                        <div
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "20px",
                                background:
                                    "linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 24px",
                            }}
                        >
                            <Search
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    color: "#86868b",
                                }}
                            />
                        </div>

                        {/* Title */}
                        <h1
                            style={{
                                fontSize: "48px",
                                fontWeight: "700",
                                color: "#1d1d1f",
                                margin: "0 0 8px",
                                letterSpacing: "-0.02em",
                            }}
                        >
                            404
                        </h1>

                        <h2
                            style={{
                                fontSize: "22px",
                                fontWeight: "600",
                                color: "#1d1d1f",
                                margin: "0 0 12px",
                            }}
                        >
                            Page non trouvée
                        </h2>

                        <p
                            style={{
                                fontSize: "15px",
                                color: "#86868b",
                                margin: "0 0 32px",
                                lineHeight: "1.5",
                            }}
                        >
                            La page que vous recherchez n'existe pas ou a été
                            déplacée.
                        </p>

                        {/* Actions */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                            }}
                        >
                            <Link
                                href="/"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    padding: "14px 24px",
                                    backgroundColor: "#1d1d1f",
                                    color: "white",
                                    borderRadius: "14px",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    textDecoration: "none",
                                    transition: "all 0.2s",
                                }}
                            >
                                <Home
                                    style={{ width: "18px", height: "18px" }}
                                />
                                Retour à l'accueil
                            </Link>

                            <button
                                onClick={() => window.history.back()}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    padding: "14px 24px",
                                    backgroundColor: "transparent",
                                    color: "#1d1d1f",
                                    border: "1px solid #d2d2d7",
                                    borderRadius: "14px",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                }}
                            >
                                <ArrowLeft
                                    style={{ width: "18px", height: "18px" }}
                                />
                                Page précédente
                            </button>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer
                    style={{
                        padding: "24px",
                        textAlign: "center",
                    }}
                >
                    <p
                        style={{
                            fontSize: "13px",
                            color: "#86868b",
                        }}
                    >
                        © 2026 TableauDeBord. Fait par Yacoub.Nivelle
                    </p>
                </footer>
            </div>
        </>
    );
}
