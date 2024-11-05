package com.example.demo.users;

public class Student extends User{
    private Integer student_ID;
    private String ciljevi_ucenja;

    public Student(String ime, String prezime, String lozinka, String email) {
        super(ime, prezime, lozinka, email);
    }

    public Student(String ime, String prezime, String lozinka, String email, String ciljevi_ucenja) {
        super(ime, prezime, lozinka, email);
        this.ciljevi_ucenja = ciljevi_ucenja;
    }

    public Integer getStudent_ID() {
        return student_ID;
    }

    public String getCiljevi_ucenja() {
        return ciljevi_ucenja;
    }

    public void setCiljevi_ucenja(String ciljevi_ucenja) {
        this.ciljevi_ucenja = ciljevi_ucenja;
    }

    @Override
    public String toString() {
        return super.toString()+"Student{" +
                "student_ID=" + student_ID +
                ", ciljevi_ucenja='" + ciljevi_ucenja + '\'' +
                '}';
    }
}