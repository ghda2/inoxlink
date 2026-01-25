export interface BrevoContact {
    email: string;
    listIds?: number[];
    attributes?: Record<string, any>;
}

export interface BrevoEmail {
    to: string;
    subject: string;
    htmlContent: string;
}

class BrevoService {
    private apiKey: string;
    private senderEmail: string;
    private senderName: string;

    constructor() {
        this.apiKey = process.env.BREVO_API_KEY || '';
        this.senderEmail = process.env.BREVO_SENDER_EMAIL || 'contato@inoxlink.com.br';
        this.senderName = process.env.BREVO_SENDER_NAME || 'Inox Link';
    }

    private async request(endpoint: string, options: RequestInit) {
        if (!this.apiKey) {
            throw new Error('BREVO_API_KEY is not defined');
        }

        const response = await fetch(`https://api.brevo.com/v3${endpoint}`, {
            ...options,
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'api-key': this.apiKey,
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Brevo API Error (${endpoint}):`, errorData);
            throw new Error(errorData.message || 'Brevo API request failed');
        }

        return response.json();
    }

    async addContact({ email, listIds, attributes }: BrevoContact) {
        return this.request('/contacts', {
            method: 'POST',
            body: JSON.stringify({
                email,
                listIds,
                attributes,
                updateEnabled: true,
            }),
        });
    }

    async sendEmail({ to, subject, htmlContent }: BrevoEmail) {
        return this.request('/smtp/email', {
            method: 'POST',
            body: JSON.stringify({
                sender: { name: this.senderName, email: this.senderEmail },
                to: [{ email: to }],
                subject,
                htmlContent,
            }),
        });
    }

    async subscribeAndWelcome(email: string) {
        // 1. Add/Update Contact
        await this.addContact({ email });

        // 2. Send Welcome Email
        return this.sendEmail({
            to: email,
            subject: "Bem-vindo ao Inox Link! 🚀 Seu portal de aço inox",
            htmlContent: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                        .header { background: #000000; padding: 40px 20px; text-align: center; }
                        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; }
                        .content { padding: 40px 30px; border: 1px solid #f0f0f0; border-top: none; }
                        .content h2 { color: #1a1a1a; font-size: 22px; margin-top: 0; }
                        .feature-list { list-style: none; padding: 0; margin: 25px 0; }
                        .feature-item { margin-bottom: 15px; display: flex; align-items: center; }
                        .feature-icon { color: #000; font-weight: bold; margin-right: 10px; }
                        .cta-button { display: inline-block; background: #000000; color: #ffffff !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
                        .footer { padding: 30px; text-align: center; font-size: 12px; color: #999; }
                        .footer a { color: #666; text-decoration: underline; }
                        .divider { border-top: 1px solid #eee; margin: 30px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>INOX LINK</h1>
                        </div>
                        <div class="content">
                            <h2>Bem-vindo à nossa comunidade!</h2>
                            <p>Olá,</p>
                            <p>É um prazer ter você conosco no <strong>Inox Link</strong>. Você acaba de se conectar ao maior ecossistema de conhecimento técnico e notícias sobre aço inox no Brasil.</p>
                            
                            <div class="feature-list">
                                <div class="feature-item"><span class="feature-icon">✓</span> Notícias exclusivas do setor</div>
                                <div class="feature-item"><span class="feature-icon">✓</span> Documentação técnica (Wiki)</div>
                                <div class="feature-item"><span class="feature-icon">✓</span> Guias de normas e aplicações</div>
                            </div>

                            <p>Prepare-se para receber conteúdos de altíssimo valor técnico diretamente na sua caixa de entrada.</p>
                            
                            <a href="https://inoxlink.com.br" class="cta-button">Acessar o Portal</a>
                            
                            <div class="divider"></div>
                            <p style="font-size: 14px;">Atenciosamente,<br><strong>Equipe Inox Link</strong></p>
                        </div>
                        <div class="footer">
                            <p>© ${new Date().getFullYear()} Inox Link. Todos os direitos reservados.</p>
                            <p>Você recebeu este e-mail porque se inscreveu em nosso portal.</p>
                            <p>
                                <a href="{{ unsubscribe }}">Cancelar inscrição</a> | 
                                <a href="https://inoxlink.com.br/contato">Suporte</a>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
    }
}

export const brevoService = new BrevoService();
