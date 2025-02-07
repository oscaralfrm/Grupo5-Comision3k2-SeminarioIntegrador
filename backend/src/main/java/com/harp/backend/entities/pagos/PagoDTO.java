package com.harp.backend.entities.pagos;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PagoDTO {
    private String nombre;
    private MultipartFile comprobante;
    private String comprobanteURL;
}
