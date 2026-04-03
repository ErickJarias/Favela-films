-- Reemplazar in_slider por dos columnas específicas por dispositivo
ALTER TABLE slider_images ADD COLUMN IF NOT EXISTS in_slider_desktop boolean DEFAULT true;
ALTER TABLE slider_images ADD COLUMN IF NOT EXISTS in_slider_mobile  boolean DEFAULT false;

-- Migrar datos existentes: lo que era in_slider=true → desktop
UPDATE slider_images SET in_slider_desktop = true  WHERE in_slider = true;
UPDATE slider_images SET in_slider_desktop = false WHERE in_slider = false;
-- Las que tienen url_mobile → también van a móvil
UPDATE slider_images SET in_slider_mobile = true WHERE url_mobile IS NOT NULL AND url_mobile != '';
