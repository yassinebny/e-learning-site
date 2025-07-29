package com.esprit.springjwt.flouci;


import com.esprit.springjwt.Mail.Mail;
import com.esprit.springjwt.entity.*;
import com.esprit.springjwt.entity.e_learning.PaiementType;
import com.esprit.springjwt.repository.IRequestRepository;
import com.esprit.springjwt.repository.RoleRepository;
import com.esprit.springjwt.repository.UserRepository;
import com.esprit.springjwt.service.GroupsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import javax.annotation.Resource;
import javax.mail.MessagingException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Controller
@RequiredArgsConstructor
public class PayementController {

    private final PayementService payementService;
    @Resource
    private GroupsService groupsService;
    @Resource
    Mail mail;
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;
    @Resource
    IRequestRepository requestRepository;
    @Autowired
    PasswordEncoder encoder;
    @GetMapping("api/payment/success")
    public String paymentSuccess(@RequestParam("payment_id") String paymentId,@RequestParam("studyplace") String studyplace,@RequestParam("email")String email,@RequestParam("period")String period,@RequestParam("paiementType") String paiementType) throws IOException {
        boolean verifPayment = payementService.verifyPayment(paymentId);
        if (verifPayment) {










            List<Request> requests=requestRepository.getRequestsByEmail(email);
            Request r = requests.get(0);
            r.setEducationPlace(studyplace);
            r.setRequestStatus(RequestStatus.PAID);
            r.setTrainingPeriod(period);
            r.setPaiementType(PaiementType.valueOf(paiementType));
            requestRepository.save(r);
            User testEmail = userRepository.findByEmail(email);
            if(testEmail != null) {
                testEmail.setEnabled(1);
                userRepository.save(testEmail);
                List<Groups>groups=groupsService.getGroupsByFormation(r.getFormation().getId());
                if(!groups.isEmpty())
                {    //bch nparcouri les groups ken el request type mt3ha 2months bch ylwj al  month 1 wonth 2 fl period fl groups wyaffecti hsinon hasb el request paymentoption bch yaffectih
                    for (Groups g : groups) {
                        System.out.print("groupdekhlin wlae"+ period);
                        if (period.equals("2months")) {

                            if (g.getPeriod().equals("month 1") || g.getPeriod().equals("month 2")) {
                                List<User> u = g.getEtudiants();
                                boolean userExists = u.stream().anyMatch(etudiant -> etudiant.getId().equals(testEmail.getId()));

                                if (!userExists) {
                                    groupsService.addEtudiantToGroup(g.getId(), testEmail.getId());
                                } else {
                                    System.out.println("User is already in the group.");
                                }
                            }
                        }
                        else if(period.equals("month 1"))
                        {
                            if (g.getPeriod().equals("month 1" )){
                                List<User> u = g.getEtudiants();
                                boolean userExists = u.stream().anyMatch(etudiant -> etudiant.getId().equals(testEmail.getId()));

                                if (!userExists) {
                                    groupsService.addEtudiantToGroup(g.getId(), testEmail.getId());
                                } else {
                                    System.out.println("User is already in the group.");
                                }
                            }
                        }
                        else if(period.equals("month 2"))
                        {
                            if (g.getPeriod().equals("month 2" ) ){
                                List<User> u = g.getEtudiants();
                                boolean userExists = u.stream().anyMatch(etudiant -> etudiant.getId().equals(testEmail.getId()));

                                if (!userExists) {
                                    groupsService.addEtudiantToGroup(g.getId(), testEmail.getId());
                                } else {
                                    System.out.println("User is already in the group.");
                                }
                            }
                        }
                    }}

                return "paymentSuccess";


            }else {
                User newUser = new User();
                newUser.setFirstName(r.getFirstName());
                newUser.setLastName(r.getLastName());
                newUser.setNumeroTel(r.getPhoneNumber());
                newUser.setUsername(email);
                newUser.setEnabled(1);



                // Encode password
                String encodedPassword = encoder.encode(r.getPhoneNumber());
                newUser.setPassword(encodedPassword);
                newUser.setCountry(r.getCountry());
                newUser.setImage( "avatarStudent.png");
                Set<Role> roles = new HashSet<>();
                Optional<Role> roleOptional = roleRepository.findByName(ERole.ETUDIANT);
                if (roleOptional.isPresent()) {
                    roles.add(roleOptional.get());
                }

                newUser.setRoles(roles);

                try {
                    mail.sendVerificationEmail(newUser);
                }catch(MessagingException e) {
                    System.out.println("Error Connexion");

                }catch(UnsupportedEncodingException e) {
                    System.out.println("Unsupported Forme");

                }
                userRepository.save(newUser);

//find groups by training id
                List<Groups> groups = groupsService.getGroupsByFormation(r.getFormation().getId());
                if(!groups.isEmpty()) {
                    //bch nparcouri les groups ken el request type mt3ha 2months bch ylwj al  month 1 wonth 2 fl period fl groups wyaffecti hsinon hasb el request paymentoption bch yaffectih
                    for (Groups g : groups) {
                        if (r.getTrainingPeriod().equals("2months")) {
                            if (g.getPeriod().equals("month 1") || g.getPeriod().equals("month 2")) {
                                List<User> u = g.getEtudiants();
                                boolean userExists = u.stream().anyMatch(etudiant -> etudiant.getId().equals(newUser.getId()));

                                if (!userExists) {
                                    groupsService.addEtudiantToGroup(g.getId(), newUser.getId());
                                } else {
                                    System.out.println("User is already in the group.");
                                }
                            }
                        } else if (r.getTrainingPeriod().equals("month 1")) {
                            if (g.getPeriod().equals("month 1")) {
                                List<User> u = g.getEtudiants();
                                boolean userExists = u.stream().anyMatch(etudiant -> etudiant.getId().equals(newUser.getId()));

                                if (!userExists) {
                                    groupsService.addEtudiantToGroup(g.getId(), newUser.getId());
                                } else {
                                    System.out.println("User is already in the group.");
                                }
                            }
                        } else if (r.getTrainingPeriod().equals("month 2")) {
                            if (g.getPeriod().equals("month 2")) {
                                List<User> u = g.getEtudiants();
                                boolean userExists = u.stream().anyMatch(etudiant -> etudiant.getId().equals(newUser.getId()));

                                if (!userExists) {
                                    groupsService.addEtudiantToGroup(g.getId(), newUser.getId());
                                } else {
                                    System.out.println("User is already in the group.");
                                }
                            }
                        }
                    }
                }












                return "paymentSuccess";
        }}else{
            return "paymentError";
        }
    }

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("api/payment/error")
    public String paymentError(){
        return "paymentError";
    }

    @PostMapping("api/payment/create")
    public ResponseEntity<?> createPayment(@RequestParam("amount") Integer amount,
                                           @RequestParam("studyplace") String studyplace,
                                           @RequestParam("email")String email,
                                           @RequestParam("period")String period,
                                           @RequestParam("paiementType") String paiementType) throws IOException {
        ResponsePayment responsePayment = payementService.generatePayment(amount,studyplace,email,period,paiementType);
        return      ResponseEntity.ok( responsePayment);
    }
}