package com.harp.backend.entities.servicio;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {

    // Podrías inyectar propiedades de configuración, etc.
    //private final String uploadDir = "uploads/";

    public String storeFile(MultipartFile file, String directorio) {
        // Aquí implementas la lógica para almacenar el archivo localmente o en la nube
        // Por ejemplo, generas un nombre único y lo guardas en una carpeta
        String originalFilename = file.getOriginalFilename();
        String filename = System.currentTimeMillis() + "_" + originalFilename;

        try {
            Path uploadPath = Paths.get(directorio);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            // Retornar la URL para acceder al archivo (asegúrate de configurar el mapeo de archivos estáticos)
            return "http://localhost:9001/" + directorio + filename;
        } catch (IOException e) {
            throw new RuntimeException("Error al almacenar el archivo", e);
        }
    }
}

