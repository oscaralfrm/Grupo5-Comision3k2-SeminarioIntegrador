//package com.harp.backend.entities.grupo;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class GrupoService implements IGrupoService {
//
//    @Autowired
//    // Hacemos inyección de dependencia del repositorio...
//    private IGrupoRepository grupoRepository;
//
//    // Sobrecargamos/cumplimos con el contrato de la interfaz...
//
//    @Override
//    public List<Grupo> getAllGrupos() {
//        return grupoRepository.findAll();
//    };
//
//    @Override
//    public void saveGrupo(Grupo grupo) { grupoRepository.save(grupo);
//    };
//
//    @Override
//    public void deleteGrupo(Long idGrupo){
//        grupoRepository.deleteById(idGrupo);
//    };
//
//    @Override
//    public Grupo findGrupo(Long idGrupo){
//        return grupoRepository.findById(idGrupo).orElse(null);
//    };
//
//    @Override
//    public void editGrupo(Long idGrupo, Grupo grupo) {
//        this.saveGrupo(grupo);
//    };
//
//
//
//}
