# 🚀 Guia de Deploy - Inox Link

Guia completo para fazer deploy do Inox Link em produção usando Docker e Caddy.

## 📋 Pré-requisitos

- VPS/Servidor com Ubuntu 20.04+ ou Debian 11+
- Docker e Docker Compose instalados
- Domínio `inoxlink.com.br` apontado para o IP do servidor
- Portas 80 e 443 abertas no firewall

## 🔧 Configuração Inicial

### 1. Instalar Docker (se necessário)

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo apt install docker-compose-plugin -y

# Verificar instalação
docker --version
docker compose version
```

### 2. Clonar o Repositório

```bash
cd /opt
sudo git clone <seu-repositorio> inoxlink
cd inoxlink
sudo chown -R $USER:$USER .
```

### 3. Configurar Variáveis de Ambiente

```bash
# Copiar exemplo para produção
cp .env.production.example .env.production

# Editar variáveis de produção
nano .env.production
```

**Variáveis obrigatórias em `.env.production`:**

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host.neon.tech/database?sslmode=require"

# Node
NODE_ENV="production"

# Auth
AUTH_SECRET="gere-uma-chave-segura-aqui"
AUTH_TRUST_HOST=true

# Cloudinary
PUBLIC_CLOUDINARY_CLOUD_NAME="djzqwht5b"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="djzqwht5b"
CLOUDINARY_API_KEY="378265788838561"
CLOUDINARY_API_SECRET="sua-chave-secreta-aqui"

# Server
HOST=0.0.0.0
PORT=4321
```

### 4. Configurar DNS

Certifique-se de que os registros DNS estão corretos:

```
Tipo: A
Nome: @
Valor: <IP-DO-SERVIDOR>
TTL: 3600

Tipo: A
Nome: www
Valor: <IP-DO-SERVIDOR>
TTL: 3600
```

## 🚀 Deploy

### Método 1: Script Automático (Recomendado)

```bash
# Dar permissão de execução
chmod +x deploy.sh

# Executar deploy
./deploy.sh
```

### Método 2: Manual

```bash
# Build e start dos containers
docker compose -f docker-compose.prod.yml up -d --build

# Verificar status
docker compose -f docker-compose.prod.yml ps

# Ver logs
docker compose -f docker-compose.prod.yml logs -f
```

## 🔍 Verificação

Após o deploy, verifique:

1. **Site funcionando**: https://inoxlink.com.br
2. **Redirect www**: https://www.inoxlink.com.br → https://inoxlink.com.br
3. **HTTPS**: Certificado SSL válido (Let's Encrypt)
4. **Admin**: https://inoxlink.com.br/admin

## 📊 Monitoramento

### Ver Logs

```bash
# Todos os logs
docker compose -f docker-compose.prod.yml logs -f

# Apenas app
docker compose -f docker-compose.prod.yml logs -f app

# Apenas Caddy
docker compose -f docker-compose.prod.yml logs -f caddy
```

### Status dos Containers

```bash
docker compose -f docker-compose.prod.yml ps
```

### Logs do Caddy (arquivos)

```bash
# Entrar no container
docker exec -it inoxlink-caddy sh

# Ver logs
cat /var/log/caddy/inoxlink.log
```

## 🔄 Atualizações

### Deploy de Nova Versão

```bash
# Opção 1: Usar script
./deploy.sh

# Opção 2: Manual
git pull
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```

### Rollback

```bash
# Voltar para versão anterior no git
git checkout <commit-hash>

# Rebuild
docker compose -f docker-compose.prod.yml up -d --build
```

## 🛠️ Manutenção

### Reiniciar Serviços

```bash
# Reiniciar tudo
docker compose -f docker-compose.prod.yml restart

# Reiniciar apenas app
docker compose -f docker-compose.prod.yml restart app

# Reiniciar apenas Caddy
docker compose -f docker-compose.prod.yml restart caddy
```

### Limpar Recursos

```bash
# Parar e remover containers
docker compose -f docker-compose.prod.yml down

# Remover volumes (cuidado!)
docker compose -f docker-compose.prod.yml down -v

# Limpar imagens antigas
docker image prune -a
```

### Backup

```bash
# Backup do volume do Caddy (certificados SSL)
docker run --rm -v inoxlink_caddy_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/caddy_backup_$(date +%Y%m%d).tar.gz -C /data .

# Restaurar backup
docker run --rm -v inoxlink_caddy_data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/caddy_backup_YYYYMMDD.tar.gz -C /data
```

## 🔒 Segurança

### Firewall (UFW)

```bash
# Permitir apenas portas necessárias
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Atualizar Sistema

```bash
# Configurar atualizações automáticas
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

### Renovação SSL

O Caddy renova automaticamente os certificados Let's Encrypt. Para forçar renovação:

```bash
docker compose -f docker-compose.prod.yml exec caddy caddy reload
```

## 🐛 Troubleshooting

### Site não carrega

```bash
# Verificar se containers estão rodando
docker compose -f docker-compose.prod.yml ps

# Verificar logs de erro
docker compose -f docker-compose.prod.yml logs app
docker compose -f docker-compose.prod.yml logs caddy

# Testar app diretamente
curl http://localhost:4321
```

### Erro SSL/HTTPS

```bash
# Verificar logs do Caddy
docker compose -f docker-compose.prod.yml logs caddy

# Verificar DNS
dig inoxlink.com.br +short

# Testar porta 80/443
sudo netstat -tlnp | grep -E '(:80|:443)'
```

### Erro de Banco de Dados

```bash
# Testar conexão com banco
docker compose -f docker-compose.prod.yml exec app \
  bun run -e "console.log(process.env.DATABASE_URL)"

# Ver logs do app
docker compose -f docker-compose.prod.yml logs app | grep -i database
```

### Performance

```bash
# Uso de recursos
docker stats

# Limpar cache do Caddy
docker compose -f docker-compose.prod.yml exec caddy rm -rf /data/caddy/cache
docker compose -f docker-compose.prod.yml restart caddy
```

## 📞 Suporte

- **Logs**: Sempre verifique os logs primeiro
- **Docker**: https://docs.docker.com
- **Caddy**: https://caddyserver.com/docs

## 🎯 Checklist de Deploy

- [ ] Servidor configurado (Docker instalado)
- [ ] DNS apontando para o servidor
- [ ] `.env.production` configurado
- [ ] Firewall configurado (portas 80, 443)
- [ ] Deploy executado com sucesso
- [ ] Site acessível via HTTPS
- [ ] Redirect www funcionando
- [ ] Admin funcionando
- [ ] Cloudinary upload testado
- [ ] Performance testada (Lighthouse)
- [ ] Backup configurado

---

**Última atualização**: 2026-01-08
