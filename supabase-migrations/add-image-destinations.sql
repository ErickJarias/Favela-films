-- Agregar columnas de destino a slider_images
-- Ejecutar en Supabase SQL Editor

ALTER TABLE slider_images ADD COLUMN IF NOT EXISTS in_slider boolean DEFAULT true;
ALTER TABLE slider_images ADD COLUMN IF NOT EXISTS in_gallery boolean DEFAULT false;
ALTER TABLE slider_images ADD COLUMN IF NOT EXISTS alt text DEFAULT '';

-- Actualizar imágenes existentes: todas van al slider por defecto
UPDATE slider_images SET in_slider = true WHERE in_slider IS NULL;
