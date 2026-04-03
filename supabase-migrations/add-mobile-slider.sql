-- Agregar URL móvil opcional a slider_images
-- Si url_mobile está vacío, el slider usa la url principal con crop automático

ALTER TABLE slider_images ADD COLUMN IF NOT EXISTS url_mobile text DEFAULT '';
