package com.example.demo.controller;

import com.example.demo.repository.UcenikRepo;
import com.example.demo.service.ucenik.UcenikService;
import com.example.demo.service.ucenik.UcenikServiceJPA;
import com.example.demo.users.Ucenik;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
public class UcenikController {

    private final UcenikServiceJPA ucenikService;

    @Autowired
    public UcenikController(UcenikServiceJPA ucenikService) {
        this.ucenikService = ucenikService;
    }

    @GetMapping("/getUcenici")
    public List<Ucenik> getUcenici() {
        return ucenikService.getUcenici();
    }

    @PostMapping("/addUcenik")
    public void registerNewUcenik(@RequestBody Ucenik ucenik){
        ucenikService.addUcenik(ucenik);
    }

}




//    @Autowired
//    private UcenikRepo studentRepo;
//    @GetMapping("/getAllStudents")
//    public ResponseEntity<List<Ucenik>> getAllStudents(){
//        try {
//            List<Ucenik> studentsList = new ArrayList<>(studentRepo.findAll());
//            if (studentsList.isEmpty()){
//                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//            }
//            return new ResponseEntity<>(studentsList, HttpStatus.OK);
//        } catch (Exception ex){
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//    @GetMapping("/getStudentById/{id}")
//    public ResponseEntity<Ucenik> getStudentById(@PathVariable Long id){
//        Optional<Ucenik> studentData = studentRepo.findById(id);
//        if (studentData.isPresent()){
//            return new ResponseEntity<>(studentData.get(), HttpStatus.OK);
//        }
//        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//    }
//    @PostMapping("/addStudent")
//    public ResponseEntity<Ucenik> addStudent(@RequestBody Ucenik student){
//        Ucenik studentObj = studentRepo.save(student);
//        return new ResponseEntity<>(studentObj, HttpStatus.OK);
//    }
//    @PostMapping("/updateStudentById/{id}")
//    public ResponseEntity<Ucenik> updateStudentById(@PathVariable Long id, @RequestBody Ucenik newStudentData){
//        Optional<Ucenik> oldStudentData = studentRepo.findById(id);
//        if(oldStudentData.isPresent()){
//            Ucenik updatedStudentData = oldStudentData.get();
//            updatedStudentData.setIme(newStudentData.getIme());
//            Ucenik studentObj = studentRepo.save(updatedStudentData);
//            return new ResponseEntity<>(studentObj, HttpStatus.OK);
//
//        }
//        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//    }
//    @DeleteMapping("/delete")
//    public ResponseEntity<Object> deleteStudentById(@PathVariable Long id){
//        studentRepo.deleteById(id);
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
//
//}
//