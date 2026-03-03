import time
import logging
import os
import json
from xmlrpc import client
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger("ai_logger")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    logger.error("GEMINI_API_KEY não encontrada no arquivo .env")


async def generate_smart_description(title: str, resource_type: str) -> dict:
    start_time = time.time()

    prompt = f"""
    Atue como um Assistente Pedagógico especialista em catalogação de materiais didáticos.
    Gere uma descrição útil para alunos e sugira 3 tags relevantes baseadas no título e tipo.
    Título: {title}
    Tipo: {resource_type}
    Responda EXATAMENTE no formato JSON abaixo:
    {{
        "description": "texto da descrição aqui",
        "tags": ["tag1", "tag2", "tag3"]
    }}
    """

    try:
        response = await client.aio.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json"),
        )

        token_usage = (
            response.usage_metadata.total_token_count if response.usage_metadata else 0
        )

        result_data = json.loads(response.text)

        latency = round(time.time() - start_time, 2)
        logger.info(
            f'[AI Request: Title="{title}", TokenUsage={token_usage}, Latency={latency}s.'
        )

        return result_data

    except Exception as e:
        logger.error(f"Falha na comunicação com o Gemini: {e}")
        raise e
