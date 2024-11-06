package com.example.demo.controller;

import com.example.demo.repository.StudentRepo;
import com.example.demo.rest.student.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
public class StudentController {
    @Autowired
    private StudentRepo studentRepo;
    @GetMapping("/getAllStudents")
    public ResponseEntity<List<Student>> getAllStudents(){
        try {
            List<Student> studentsList = new ArrayList<>(studentRepo.findAll());
            if (studentsList.isEmpty()){
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(studentsList, HttpStatus.OK);
        } catch (Exception ex){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/getStudentById/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id){
        Optional<Student> studentData = studentRepo.findById(id);
        if (studentData.isPresent()){
            return new ResponseEntity<>(studentData.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @PostMapping("/addStudent")
    public ResponseEntity<Student> addStudent(@RequestBody Student student){
        Student studentObj = studentRepo.save(student);
        return new ResponseEntity<>(studentObj, HttpStatus.OK);
    }
    @PostMapping("/updateStudentById/{id}")
    public ResponseEntity<Student> updateStudentById(@PathVariable Long id, @RequestBody Student newStudentData){
        Optional<Student> oldStudentData = studentRepo.findById(id);
        if(oldStudentData.isPresent()){
            Student updatedStudentData = oldStudentData.get();
            updatedStudentData.setName(newStudentData.getName());
            Student studentObj = studentRepo.save(updatedStudentData);
            return new ResponseEntity<>(studentObj, HttpStatus.OK);

        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<Object> deleteStudentById(@PathVariable Long id){
        studentRepo.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    
}
