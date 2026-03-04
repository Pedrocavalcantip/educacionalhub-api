# 🎓 EducacionalHub - Hub Inteligente de Recursos Educacionais

![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-AI-orange.svg)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-lightgrey.svg)

## 📖 Sobre o Projeto
O **EducacionalHub** é uma aplicação Fullstack desenvolvida para o gerenciamento centralizado de materiais didáticos. Projetado para otimizar o tempo e o esforço de conteudistas, o sistema atua não apenas como um repositório, mas como um **Assistente Pedagógico Inteligente** (Smart Assist). 

Utilizando a API do **Google Gemini**, o sistema sugere automaticamente descrições engajadoras e categoriza o material com tags relevantes, bastando apenas o título e o tipo do conteúdo.

---

## ✨ Funcionalidades Implementadas

### 📌 Requisitos Funcionais Obrigatórios
- [x] **CRUD Completo de Recursos**: Cadastro, listagem, edição e exclusão.
- [x] **Paginação**: Listagem de recursos otimizada utilizando `skip` e `limit`.
- [x] **Campos Estruturados**: Título, Tipo (Vídeo, PDF, Link), URL (ou upload de arquivo) e Tags.
- [x] **Smart Assist (IA)**: Botão no frontend que envia Título + Tipo ao backend e retorna Descrição + 3 Tags sugeridas.
- [x] **Upload de Arquivos**: Suporte a upload de PDFs armazenados de forma estruturada.

### 🛠️ Requisitos Técnicos Obrigatórios
- [x] **Backend Moderno**: API RESTful construída em **Python + FastAPI** .
- [x] **Validação de Dados**: Uso estrito do **Pydantic** para contratos de entrada/saída.
- [x] **Banco de Dados**: SQLite configurado com SQLAlchemy (ORM).
- [x] **Integração com LLM**: Google Gemini API via SDK oficial, com prompts otimizados.
- [x] **Segurança**: Chaves sensíveis isoladas em um arquivo `.env` (ignorado no `.gitignore`).
- [x] **Frontend SPA**: Desenvolvido em **React.js com TypeScript** e **TailwindCSS** para estilização.
- [x] **Feedback Visual e Tratamento de Erros**: Estado de *loading* (" Pensando...") no botão da IA e captação de falhas (falta de preenchimento, indisponibilidade do serviço).

### 🚀 Diferenciais e Observabilidade (DevOps)
- [x] **Integração Contínua (CI)**: Pipeline configurado no `.github/workflows/ci.yml` rodando **Black** e **Flake8** no backend para garantir a qualidade do código.
- [x] **Observabilidade e Logs**: Implementação do módulo `logging` no backend. Interações com a IA geram logs em formato padronizado (Ex: `[INFO] AI Request: Title="Matemática", Latency=1.8s, TokenUsage=152`).
- [x] **Prompt Engineering Avançado**: Contexto customizado instruindo o LLM a atuar como um *Assistente Pedagógico Especialista*, garantindo linguagem adequada para estudantes e resposta em estrito formato `JSON`.
- [x] **Health Check**: Endpoint dedicado `/health` para monitoramento de disponibilidade da API.

---

## 🛠️ Tecnologias Utilizadas

**Backend:**
* [Python 3.11+](https://www.python.org/)
* [FastAPI](https://fastapi.tiangolo.com/) - Framework web rápido e moderno.
* [Pydantic & SQLAlchemy](https://docs.pydantic.dev/) - Validação de schemas e manipulação de DB.
* [Google GenAI SDK](https://ai.google.dev/) - Integração LLM Gemini.
* [Python-Dotenv](https://pypi.org/project/python-dotenv/) - Gerenciamento de variáveis ambiente.

**Frontend:**
* [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
* [TypeScript](https://www.typescriptlang.org/) - Tipagem estática garantida.
* [TailwindCSS](https://tailwindcss.com/) - Design System rápido e customizável.

---

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
- **[Python 3.11+](https://www.python.org/downloads/)**
- **[Node.js (v18+)](https://nodejs.org/)**
- **Git**

---

## 🚀 Como Executar o Projeto Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/educacionalhub-api.git
cd educacionalhub-api
```

### 2. Configurar o Backend (API)
```bash
cd backend

# Criar um ambiente virtual e ativá-lo
python -m venv venv
# No Windows:
venv\Scripts\activate
# No Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# > Abra o arquivo .env e coloque sua chave GEMINI_API_KEY.

# Iniciar o servidor de desenvolvimento
uvicorn app.main:app --reload
```
A API estará disponível em `http://127.0.0.1:8000`. Você pode testar os endpoints na documentação interativa gerada automaticamente pelo FastAPI acessando `http://127.0.0.1:8000/docs`.


> **Nota sobre Uploads:** O sistema salva os PDFs enviados na rota de upload na pasta `backend/uploads/`. O repositório já conta com um arquivo `.gitkeep` nesta pasta para garantir que ela exista ao ser clonado pelo Git, evitando Erros 500 no File System.

### 3. Configurar o Frontend (SPA)
Em uma nova aba de terminal:
```bash
cd frontend

# Instalar dependências
npm install

# Iniciar o projeto
npm run dev
```
O Frontend estará acessível no seu navegador pelo endereço fornecido no terminal (`http://localhost:5173`).

> ⚠️ **Aviso de Conexão Frontend -> Backend:** O frontend interage com o backend via *fetch*. A URL-base da API está *hardcoded* estritamente para apontar globalmente para `http://127.0.0.1:8000`. Portanto, é de alta importância **não executar o backend (Uvicorn) em uma porta alternativa**, caso contrário poderão ocorrer falhas de CORS ou recusas de requisição.

---

## 🔑 Variáveis de Ambiente (.env)

No diretório `backend`, você precisa criar um arquivo `.env` com a seguinte estrutura:

```env
GEMINI_API_KEY=sua_chave_api_do_google_gemini_aqui
```
*A chave do Gemini tem uma camada gratuita generosa, você pode obtê-la no [Google AI Studio](https://aistudio.google.com/app/apikey).*

---

## 📡 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Retorna o status de saúde da aplicação (`{"status": "ok"}`). |
| `GET` | `/resources/` | Lista paginada de todos os recursos educacionais. |
| `POST` | `/resources/` | Cria um novo recurso no repositório. |
| `PUT` | `/resources/{id}` | Edita um recurso existente pelo seu ID. |
| `DELETE`| `/resources/{id}` | Remove um recurso do banco de dados. |
| `POST` | `/resources/smart-assist`| Aciona a IA (Gemini) e retorna a descrição pedagógica e as tags. |
| `POST` | `/resources/upload-pdf`| Faz o upload seguro de arquivos físicos (PDF). |

---

## 💡 Destaques de Arquitetura e Decisões Técnicas
- **Gerenciamento Unificado de Arquivos e URLs**: O sistema abstrai a diferença entre um conteúdo externo (Link/Vídeo) e um arquivo físico local. Para conteúdos em PDF, o backend utiliza a classe nativa `UploadFile` (integrada ao Pydantic/FastAPI) e a biblioteca nativa `shutil` do Python para fazer o streaming direto e não-bloqueante do binário para a pasta `backend/uploads`. A URL salva no banco de dados reflete um caminho relativo já servido pelo `StaticFiles` do FastAPI, unificando o Frontend para acessar via `<a href>` independentemente da natureza do arquivo.
- **Engenharia de Prompt Avançada**: O prompt para a IA foi desenhado com um *roleplay* estrito (Assistente Pedagógico). Ele força o LLM a responder **exclusivamente em JSON válido**, evitando comportamentos indesejados da API (como textos avulsos ou quebra de formatação).
- **Code Quality Contínuo**: A integração de CI (GitHub Actions) roda linters restritos (Black e Flake8), garantindo que todo código ingressado siga rigorosamente a PEP-8 e as boas práticas da linguagem Python.
- **Integração Tipada (Contract-First)**: Foi estabelecida uma correspondência estrita entre os Schemas Pydantic (Backend) e as Interfaces TypeScript (Frontend). Isso mitiga completamente falhas clássicas de *Type Casing* no consumo da API.
- **Paginação Server-Side**: Para garantir escalabilidade do sistema conforme o repositório de conteúdo cresça escolarmente, o backend implementa paginação nativa via SQLAlchemy usando Query Parameters (`skip` e `limit`). O frontend calcula os estados ativando retrocessos e avanços de página dinamicamente sem sobrecarregar o *heap* do navegador.
- **Micro-interações e Design Neo-Brutalista**: A interface foge do padrão genérico e abraça a tendência **Neo-Brutalism (Neobrutalismo)** usando TailwindCSS. Com cores contrastantes de alto impacto, cordas grossas, sombras `box-shadow` duras (sem desfoque) e tipografia pesada (`font-black`), a aplicação passa um aspecto moderno, lúdico e altamente acessível (perfeito para o contexto educacional). Associado a isso, todos os botões possuem feedback assíncrono durante requisições e animações rígidas no clique (`active:translate-y`).

---
> ⚠️ **Dica Importante:** Caso não possua uma API Key válida do Google Gemini neste momento, certifique-se de preencher o `.env` ou testar com uma chave gratuita (Free Tier). O sistema possui tratamento de erro amigável na UI caso ocorra timeout ou interrupção na comunicação com o LLM.
