import time
import logging
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger("ai_logger")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    logger.error("[ERROR] GEMINI_API_KEY não encontrada no arquivo .env!")

async def generate_smart_description(title: str, resource_type: str) -> dict:
    start_time = time.time()
    
    model = genai.GenerativeModel('gemini-1.5-flash')
    
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
        response = await model.generate_content_async(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        token_usage = response.usage_metadata.total_token_count if response.usage_metadata else 0
            
        result_data = json.loads(response.text)
        
        latency = round(time.time() - start_time, 2)
        logger.info(f'[INFO] AI Request: Title="{title}", TokenUsage={token_usage}, Latency={latency}s.')
        
        return result_data
        
    except Exception as e:
        logger.error(f"[ERROR] Falha na comunicação com o Gemini: {e}")
        raise e