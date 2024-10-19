//package com.harp.backend.entities.categoria;
//
//import jakarta.validation.constraints.NotEmpty;
//import jakarta.validation.constraints.Size;
//import lombok.Builder;
//import lombok.Getter;
//import lombok.Setter;
//import lombok.ToString;
//
//@Builder
//@ToString
//@Getter
//@Setter
//public class CategoriaDTO {
//    private Long id;
//    @Size(max = 25)
//    @NotEmpty(message = "Nombre requerido")
//    private String nombre;
//
//    public CategoriaDTO(Long id, String nombre) {
//        this.id = id;
//        this.nombre = nombre;
//    }
//
//    public CategoriaDTO() {
//    }
//}
