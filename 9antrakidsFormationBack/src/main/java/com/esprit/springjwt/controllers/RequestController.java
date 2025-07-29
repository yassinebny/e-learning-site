package com.esprit.springjwt.controllers;

import com.esprit.springjwt.Mail.Mail;
import com.esprit.springjwt.config.EncryptionUtils;
import com.esprit.springjwt.dto.RequestDto;
import com.esprit.springjwt.entity.*;
import com.esprit.springjwt.entity.e_learning.PaiementType;
import com.esprit.springjwt.exception.RecordNotFoundException;
import com.esprit.springjwt.exception.StatusErrorException;
import com.esprit.springjwt.repository.FormationRepository;
import com.esprit.springjwt.repository.IRequestRepository;
import com.esprit.springjwt.repository.RoleRepository;
import com.esprit.springjwt.repository.UserRepository;
import com.esprit.springjwt.service.EmailServiceImpl;
import com.esprit.springjwt.service.GroupsService;
import com.esprit.springjwt.service.IRequestService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.esprit.springjwt.payload.response.MessageResponse;
import org.thymeleaf.TemplateEngine;

import javax.annotation.Resource;
import javax.crypto.SecretKey;
import javax.mail.MessagingException;
import javax.naming.Context;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/request")
public class RequestController {

    @Autowired
    private IRequestService requestService;

    @Autowired
    EmailServiceImpl emailService;
    
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    RoleRepository roleRepository;
    @Resource
    FormationRepository formationRepository;
    @Resource
    IRequestRepository requestRepository;
    @Autowired
    PasswordEncoder encoder;
    @Resource
    private  TemplateEngine templateEngine;
    @Resource
    private GroupsService groupsService;
    @Resource
    Mail mail;
    @Resource
    private EncryptionUtils encryptionUtils;
    @Value("${site.base.url.https}")
    private String baseURL;

    @PostMapping("/{idFormation}")
    public ResponseEntity<?> AddRequest(@RequestParam(name = "request") String request, @PathVariable("idFormation") Long idFormation) {

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            Optional<Formation> f = formationRepository.findById(idFormation);
            Formation formation =new Formation();
            if (f.isPresent())
            {
                 formation=f.get();
            }


            Request  request1= requestRepository.findByEmailAndFormationAndTrainingPeriod
                (objectMapper.readValue(request, Request.class).getEmail(),formation,objectMapper.readValue(request, Request.class).getTrainingPeriod());
            Request   reqfullpaid=requestRepository.findByEmailAndFormationAndTrainingPeriod
                    (objectMapper.readValue(request, Request.class).getEmail(),formation,"2months");
            Request   reqperiod1paid=requestRepository.findByEmailAndFormationAndTrainingPeriod
                    (objectMapper.readValue(request, Request.class).getEmail(),formation,"month 1");
            Request   reqperiod2=requestRepository.findByEmailAndFormationAndTrainingPeriod
                    (objectMapper.readValue(request, Request.class).getEmail(),formation,"month 2");



            if (request1 != null && request1.getEmail() != null && !request1.getEmail().isEmpty()) {
                return ResponseEntity.badRequest().body("You already sent a request!");
            } else if (reqfullpaid != null && reqfullpaid.getEmail() != null && !reqfullpaid.getEmail().isEmpty()) {
                return ResponseEntity.badRequest().body("You already Paid for this training!");
            } else if (reqperiod2 != null && reqperiod2.getEmail() != null && !reqperiod2.getEmail().isEmpty() && reqperiod2.getRequestStatus() == RequestStatus.PAID) {
                return ResponseEntity.badRequest().body("You already Paid for period 2 of this training!");
            } else if (reqperiod2 != null && reqperiod2.getEmail() != null && !reqperiod2.getEmail().isEmpty() && reqperiod2.getRequestStatus() == RequestStatus.UNPAID) {
                return ResponseEntity.badRequest().body("You already sent a request for period 2 of this training we sent you an email for payment!");
            } else if (reqperiod1paid != null && reqperiod1paid.getEmail() != null && !reqperiod1paid.getEmail().isEmpty()) {
                reqperiod1paid.setTrainingPeriod("month 2");
                reqperiod1paid.setRequestStatus(RequestStatus.UNPAID);

                            Request r = requestService.add(reqperiod1paid, idFormation);
                            Long id=r.getId();
                            String newBaseURL=baseURL+"/payment?id="+id;
                String newBaseURL2=baseURL+"/payment/requestdetails/"+id;
                            org.thymeleaf.context.Context context=new org.thymeleaf.context.Context();
                            context.setVariable("firstName", r.getFirstName());
                            context.setVariable("lastName", r.getLastName());
                            context.setVariable("formationName", r.getFormation().getNomFormation());
                            context.setVariable("link",newBaseURL);

                            String msgwithoutonlinepaiement=templateEngine.process("simple-email-onsite-template", context);
                            String subject = "Bienvenue sur 9antraTraining";


                            System.out.println(emailService.sendSimpleMail(r.getEmail(), subject,msgwithoutonlinepaiement));
                            return new ResponseEntity<>(r, HttpStatus.OK);
                        }
                        else if(requestRepository.getRequestsByEmail(objectMapper.readValue(request, Request.class).getEmail())==null||requestRepository.getRequestsByEmail(objectMapper.readValue(request, Request.class).getEmail()).isEmpty())
                        {
                            Request r = requestService.add(objectMapper.readValue(request, Request.class), idFormation);
                            Long id=r.getId();
                            String newBaseURL=baseURL+"/payment?id="+id;
                            String newBaseURL2=baseURL+"/payment/requestdetails/"+id;
                            org.thymeleaf.context.Context context=new org.thymeleaf.context.Context();
                            context.setVariable("firstName", r.getFirstName());
                            context.setVariable("lastName", r.getLastName());
                            context.setVariable("formationName", r.getFormation().getNomFormation());
                            context.setVariable("details",newBaseURL2);
                            context.setVariable("link",newBaseURL);

                            String msgwithoutonlinepaiement=templateEngine.process("simple-email-onsite-template", context);
                            String msgwithonlinepaiement=templateEngine.process("simple-email-online-template", context);



                            String subject = "Bienvenue sur 9antraTraining";


                            System.out.println(emailService.sendSimpleMail(r.getEmail(), subject,msgwithoutonlinepaiement));
                            return new ResponseEntity<>(r, HttpStatus.OK);
                        }
                        else {
                            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
                        }








            /**    if (request1 == null || request1.getEmail() == null || request1.getEmail().isEmpty()
                  ) {
              Request r = requestService.add(objectMapper.readValue(request, Request.class), idFormation);
              Long id=r.getId();

                String requestData = objectMapper.writeValueAsString(r);
                System.out.println(" requestData " +  requestData); // Log encrypted data
                String encryptedData = "";
                String encodedData="";
                String encryptedSessionKey = "";
                try {
                    SecretKey sessionKey = EncryptionUtils.generateKey();
                    encryptedData = EncryptionUtils.encrypt(requestData, sessionKey);
                    encodedData = URLEncoder.encode(encryptedData, StandardCharsets.UTF_8.toString());
                    encryptedSessionKey = EncryptionUtils.encryptKey(sessionKey);

                    System.out.println("Encrypted Data: " + encryptedData); // Log encrypted data
                    System.out.println("Encoded Data: " + encodedData);     // Log encoded data
                    System.out.println("Encrypted Session Key: " + encryptedSessionKey); // Log encrypted session key


                } catch ( Exception e) {
                    // Handle the exception appropriately, e.g., logging or throwing a runtime exception
                    e.printStackTrace();
                }
                System.out.println("Encrypted Data: " + encryptedData); // Log encrypted data
                System.out.println("Encoded Data: " + encodedData);     // Log encoded data
                String newBaseURL = baseURL+"/payment?data=" + encodedData + "&ee=" + encryptedSessionKey;
              String newBaseURL=baseURL+"/payment?id="+id;
                org.thymeleaf.context.Context context=new org.thymeleaf.context.Context();
                context.setVariable("firstName", r.getFirstName());
                context.setVariable("lastName", r.getLastName());
                context.setVariable("formationName", r.getFormation().getNomFormation());
                context.setVariable("link",newBaseURL);

                String msgwithoutonlinepaiement=templateEngine.process("simple-email-onsite-template", context);
                String msgwithonlinepaiement=templateEngine.process("simple-email-online-template", context);



                String subject = "Bienvenue sur 9antraTraining";


                    System.out.println(emailService.sendSimpleMail(r.getEmail(), subject,msgwithoutonlinepaiement));
            return new ResponseEntity<>(r, HttpStatus.OK);}*/

        } catch (RecordNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NO_CONTENT);
        } catch (JsonProcessingException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }


    @GetMapping
    public ResponseEntity<?> getRequests() {
        List<RequestDto> requests = requestService.getAll();
        if(!requests.isEmpty())
            return new ResponseEntity<>(requests, HttpStatus.OK);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/{id}/{status}")
    public ResponseEntity<?> changeStatus(@PathVariable("status")RequestStatus status, @PathVariable("id")Long idRequest) {

        try {
            requestService.changeStatus(status, idRequest);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RecordNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (StatusErrorException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }
    @PatchMapping("period/{id}/{period}")
    public ResponseEntity<?> changePeriod(@PathVariable("period")String period, @PathVariable("id")Long idRequest) {

        try {
            requestService.changePeriod(period, idRequest);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RecordNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (StatusErrorException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }
    @PatchMapping("paytype/{id}/{paytype}")
    public ResponseEntity<?> changePaytype(@PathVariable("paytype")String paytype, @PathVariable("id")Long idRequest) {

        try {
            requestService.changePaytype(paytype, idRequest);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RecordNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (StatusErrorException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }


    @GetMapping("/getRequestsByEmail")
    public ResponseEntity<?> getRequestsByEmail(@RequestParam("email") String email) {
    	List<Request> requests = requestService.getRequestsByEmail(email);
    	return ResponseEntity.ok(requests);
    }
    @GetMapping("getbyid")
    public ResponseEntity<?> getRequestsByid(@RequestParam("id") Long id) {
        Request requests = requestService.getOneById(id);
        return ResponseEntity.ok(requests);
    }

    /* @GetMapping("/getunpaidonlineRequestsByEmail")
    public ResponseEntity<?>getunpaidonlineRequestsByEmail(@RequestParam("email") String email) {
        List<Request> requests = requestService.getRequestsByEmailandrequeststatusandpaiementType(email);
        return ResponseEntity.ok(requests);
    }*/
@PatchMapping("updaterequestafterpaiement")
     public ResponseEntity<?>updaterequestafterpaiement(@RequestParam("studyplace") String studyplace,@RequestParam("email")String email,@RequestParam("period")String period,@RequestParam("paiementType") String paiementType)
{
    List<Request>requests=requestRepository.getRequestsByEmail(email);
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

        return ResponseEntity.ok(testEmail);


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
        } else {
            return ResponseEntity.ok("Error: Role not found!");
        }

        newUser.setRoles(roles);

        try {
            mail.sendVerificationEmail(newUser);
        }catch(MessagingException e) {
            return new ResponseEntity<String>("Error Connexion",HttpStatus.CONFLICT);
        }catch(UnsupportedEncodingException e) {
            return new ResponseEntity<String>("Unsupported Forme",HttpStatus.CONFLICT);
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
        return ResponseEntity.ok(r);

    }

}


}
