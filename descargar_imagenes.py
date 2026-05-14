#!/usr/bin/env python3
"""
Descargador de imágenes de productos - Sin copyright
Usa Unsplash API (gratuito)
"""

import os
import requests
import time
from pathlib import Path

# Configuración
UNSPLASH_ACCESS_KEY = "LcZYR3P6VH_1Ha_3kgE2udeACCN8QzU3e870bo20x1s"
OUTPUT_DIR = "tfg_adventure/public/Img/productos"

# Mapeo de productos con keywords relevantes
PRODUCTOS = {
    1: {"nombre": "Bota de Trekking Waterproof Premium", "keywords": "hiking boots mountain", "stock": 36},
    2: {"nombre": "Zapatilla Trail Running Amortiguada", "keywords": "trail running shoes", "stock": 36},
    3: {"nombre": "Bota de Alta Montaña Profesional", "keywords": "alpine mountain boots snow", "stock": 20},
    4: {"nombre": "Sandalia Trekking Casual", "keywords": "hiking sandals outdoor", "stock": 78},
    5: {"nombre": "Bota Senderismo Infantil", "keywords": "kids hiking boots children", "stock": 35},
    6: {"nombre": "Zapatilla de Aproximación Ligera", "keywords": "climbing approach shoes", "stock": 24},
    7: {"nombre": "Bota Senderismo Ligera y Cómoda", "keywords": "lightweight hiking boots", "stock": 54},
    8: {"nombre": "Calcetín Técnico Trekking Grueso", "keywords": "hiking socks merino wool", "stock": 99},
    9: {"nombre": "Mochila Senderismo 20L Compacta", "keywords": "day hiking backpack 20l", "stock": 70},
    10: {"nombre": "Mochila Senderismo 40L Versátil", "keywords": "trekking backpack 40l", "stock": 40},
    11: {"nombre": "Mochila Montaña 60L Grande", "keywords": "large hiking backpack 60l", "stock": 25},
    12: {"nombre": "Mochila de Día Hiking 10L Ultracompacta", "keywords": "small backpack 10l compact", "stock": 90},
    13: {"nombre": "Mochila Escalada y Vía Ferrata 22L", "keywords": "climbing backpack rock", "stock": 30},
    14: {"nombre": "Mochila de Hidratación Trail 10L", "keywords": "trail running hydration pack", "stock": 45},
    15: {"nombre": "Mochila Trekking Mujer 30L", "keywords": "women hiking backpack", "stock": 35},
    16: {"nombre": "Chubasquero Senderismo Impermeable", "keywords": "rain jacket hiking waterproof", "stock": 50},
    17: {"nombre": "Forro Polar Trekking 300g Fleece", "keywords": "fleece jacket outdoor warm", "stock": 60},
    18: {"nombre": "Pantalón Trekking Convertible a Bermuda", "keywords": "convertible hiking pants", "stock": 65},
    19: {"nombre": "Camiseta Técnica Merino 100% Hombre", "keywords": "merino wool shirt men", "stock": 55},
    20: {"nombre": "Chaqueta Softshell Montaña Windstop", "keywords": "softshell jacket windproof", "stock": 40},
    21: {"nombre": "Legging Trekking Mujer Elástico", "keywords": "women hiking leggings", "stock": 70},
    22: {"nombre": "Poncho Lluvia Ultraligero Plegable", "keywords": "rain poncho lightweight", "stock": 80},
    23: {"nombre": "Chaleco Acolchado Down Ligero", "keywords": "down vest jacket lightweight", "stock": 30},
    24: {"nombre": "Bastones Plegables Trekking Carbono", "keywords": "trekking poles carbon", "stock": 40},
    25: {"nombre": "Bastones Aluminio Telescópicos", "keywords": "hiking poles aluminum", "stock": 75},
    26: {"nombre": "Bastón Nórdico Nordic Walking", "keywords": "nordic walking poles", "stock": 50},
    27: {"nombre": "Frontal LED 200 Lúmenes 3 Modos", "keywords": "headlamp LED light", "stock": 85},
    28: {"nombre": "Frontal Recargable USB 500 Lúmenes", "keywords": "rechargeable headlamp USB", "stock": 45},
    29: {"nombre": "Linterna Compacta de Mano 250 Lúmenes", "keywords": "flashlight compact hand", "stock": 60},
    30: {"nombre": "Gafas de Sol Polarizadas Montaña", "keywords": "polarized sunglasses mountain", "stock": 55},
    31: {"nombre": "Guantes de Trekking Elasticados", "keywords": "hiking gloves outdoor", "stock": 90},
    32: {"nombre": "Gorro Merino Trekking Reversible", "keywords": "merino beanie hat", "stock": 75},
    33: {"nombre": "Braga de Cuello Merino Multifunción", "keywords": "neck gaiter merino wool", "stock": 80},
    34: {"nombre": "Cinturón Riñonera Running 1L", "keywords": "running belt fanny pack", "stock": 95},
    35: {"nombre": "Arnés de Escalada Regulable", "keywords": "climbing harness rock", "stock": 35},
    36: {"nombre": "Cuerda Dinámica 10mm x 50m Impermeable", "keywords": "climbing rope dynamic", "stock": 15},
    37: {"nombre": "Mosquetón HMS Seguro Automático", "keywords": "carabiner climbing gear", "stock": 50},
    38: {"nombre": "Pies de Gato Escalada con Velcro", "keywords": "climbing shoes rock", "stock": 25},
    39: {"nombre": "Casco de Escalada Polivalente", "keywords": "climbing helmet safety", "stock": 30},
    40: {"nombre": "Magnesio Escalada Polvo 200g + Bolsa", "keywords": "climbing chalk powder", "stock": 70},
    41: {"nombre": "Crampones Aluminio 10 Puntas Universal", "keywords": "crampons ice climbing", "stock": 20},
    42: {"nombre": "Tienda de Campaña 2 Personas Igloo", "keywords": "tent camping 2 person", "stock": 20},
    43: {"nombre": "Saco de Dormir 15°C Rectangular", "keywords": "sleeping bag camping", "stock": 40},
    44: {"nombre": "Saco de Dormir Plumón 0°C Momia", "keywords": "down sleeping bag mummy", "stock": 15},
    45: {"nombre": "Esterilla Autoinflable 3cm Aislante", "keywords": "sleeping mat camping", "stock": 30},
    46: {"nombre": "Hornillo de Gas Ultracompacto", "keywords": "camping stove portable", "stock": 50},
    47: {"nombre": "Batería Solar 10000mAh Powerbank", "keywords": "solar power bank outdoor", "stock": 25},
    48: {"nombre": "Botella de Agua Tritan 0,8L", "keywords": "water bottle hiking", "stock": 100},
    49: {"nombre": "Botella Aislante Acero Inoxidable 0,5L", "keywords": "thermos bottle steel", "stock": 80},
    50: {"nombre": "Bolsa de Hidratación Softflask 2L", "keywords": "hydration bladder pack", "stock": 60},
    51: {"nombre": "Pastillas Potabilizadoras 50 Unidades", "keywords": "water purification tablets", "stock": 90},
    52: {"nombre": "Filtro de Agua Portátil Fibra Hueca", "keywords": "water filter portable", "stock": 35},
    53: {"nombre": "Botiquín de Primeros Auxilios Compacto", "keywords": "first aid kit emergency", "stock": 65},
    54: {"nombre": "GPS de Mano Portátil con Mapas", "keywords": "GPS device hiking navigation", "stock": 8},
    55: {"nombre": "Silbato de Emergencia Alta Potencia 100dB", "keywords": "emergency whistle outdoor", "stock": 100},
    56: {"nombre": "Manta Térmica de Emergencia Isotérmica", "keywords": "emergency blanket thermal", "stock": 100},
    57: {"nombre": "Spray Repelente Insectos DEET 50%", "keywords": "insect repellent spray", "stock": 75},
}

def create_directories():
    Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)
    print(f"✅ Directorio creado: {OUTPUT_DIR}")

def download_image(product_id, keywords):
    url = "https://api.unsplash.com/photos/random"
    params = {
        "query": keywords,
        "client_id": UNSPLASH_ACCESS_KEY,
        "orientation": "portrait",
        "w": 400,
        "h": 500,
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        img_url = data['urls']['regular']
        img_response = requests.get(img_url, timeout=10)
        img_response.raise_for_status()
        
        filename = f"{OUTPUT_DIR}/producto_{product_id:02d}.jpg"
        with open(filename, 'wb') as f:
            f.write(img_response.content)
        
        print(f"✅ ID {product_id}: {keywords} → {filename}")
        time.sleep(1)
        return True
        
    except Exception as e:
        print(f"❌ ID {product_id}: Error descargando → {str(e)}")
        return False

def main():
    print("🖼️  Descargador de imágenes de productos (Unsplash - Sin Copyright)")
    print("=" * 70)
    
    create_directories()
    print(f"\n📥 Descargando {len(PRODUCTOS)} imágenes...\n")
    
    downloaded = 0
    failed = 0
    
    for product_id, product_info in PRODUCTOS.items():
        if download_image(product_id, product_info['keywords']):
            downloaded += 1
        else:
            failed += 1
    
    print("\n" + "=" * 70)
    print(f"✅ Completado: {downloaded} descargadas, {failed} fallidas")
    print(f"📁 Imágenes guardadas en: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
