package com.esprit.springjwt.controllers;


import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import com.esprit.springjwt.dto.RequestDto;
import com.esprit.springjwt.entity.*;
import com.esprit.springjwt.exception.ResourceNotFoundException;
import com.esprit.springjwt.repository.GroupsRepository;
import com.esprit.springjwt.service.*;
import org.springdoc.webmvc.core.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.esprit.springjwt.service.FormationService;
import com.esprit.springjwt.service.GroupsService;
import com.esprit.springjwt.service.SessionService;

@RestController
@RequestMapping("/api/groups")
public class GroupsController {
    private final GroupsService groupsService;
    @Autowired
    private FormationService trainingService;
    @Autowired
    private  SessionService sessionService;

    @Autowired
    private userService userService;
    @Autowired
    private GroupsRepository groupsRepository;

@Resource
private IRequestService requestService;

    @Autowired
    public GroupsController(GroupsService groupsService) {
        this.groupsService = groupsService;
    }
   /* @GetMapping("/user/{userId}")
    public List<Groups> findGroupsByUserId(@PathVariable Long userId) {
        return groupsRepository.findGroupsByUserId(userId);
    }*/
    @GetMapping("/all")
    public List<Groups> getAllGroups() {
        return groupsService.getAllGroups();
    }
    
   /* @GetMapping("/session/{sessionId}")

    @GetMapping("/session/{sessionId}")

    public ResponseEntity<List<Groups>> getGroupsBySessionId(@PathVariable Long sessionId) {
        List<Groups> groups = groupsService.getGroupsBySessionId(sessionId);
        if (!groups.isEmpty()) {
            return ResponseEntity.ok(groups);
        }
        return ResponseEntity.noContent().build();

    }*/
   @GetMapping("/session/{sessionId}")
   public ResponseEntity<List<Groups>> getGroupsBySessionId(@PathVariable Long sessionId) {
       List<Groups> groups = groupsService.getGroupsBySessionId(sessionId);
       if (!groups.isEmpty()) {
           return ResponseEntity.ok(groups);
       }
       return ResponseEntity.noContent().build();
   }



    @PostMapping("/add")
    public ResponseEntity<?> addGroups(@Valid @RequestBody Groups groups) {
        String GroupName = groups.getGroupName();
        boolean groupNameExists = groupsService.checkIfGroupNameExists(GroupName);
        groups.setCertificatesGenerated(false);
        // Check if the groupName already exists
        if (groupNameExists) {
            return ResponseEntity.badRequest().body("Group name already exists");
        }

        Groups createdGroup = groupsService.addGroups(groups);
        //njib list mt3 requests  ken fma request b user paid bnfs lperiod mt3 group yajoutih
        List<RequestDto>requests=requestService.getAll();
        if(!requests.isEmpty()){
        for (RequestDto r:requests)

        { if((r.getTrainingPeriod().equals(createdGroup.getPeriod())||r.getTrainingPeriod().equals("2months") )&& r.getRequestStatus()== RequestStatus.PAID||(r.getTrainingPeriod().equals("month 2") )&& r.getRequestStatus()== RequestStatus.PAID)
        {  User u= userService.getUserByEmail(r.getEmail());
            groupsService.addEtudiantToGroup(createdGroup.getId(),u.getId());

        }

        }}
        return ResponseEntity.ok(createdGroup);
    }

    @GetMapping("/{id}")
    public Groups getGroupsById(@PathVariable("id") Long id) {
        return groupsService.getGroupsById(id);
    }

    
    @GetMapping("/by-formation/{id}")
    public List<Groups> getGroupsByFormation(@PathVariable("id") Long Id) {
        return groupsService.getGroupsByFormation(Id);
    }
    

    @PutMapping("/update")
    public Groups updateGroups(@Valid @RequestBody Groups groups) {
        groups.setCertificatesGenerated(false);


        return groupsService.updateGroups(groups);
    }

    @DeleteMapping("/{id}")
    public void deleteGroups(@PathVariable("id") Long id) {
        groupsService.deleteGroups(id);
    }

    @PostMapping("/{groupId}/etudiants/{etudiantId}")
    public ResponseEntity<?> addEtudiantToGroup(@PathVariable Long groupId, @PathVariable Long etudiantId) {
        User result= new User();
        try {
           result= groupsService.addEtudiantToGroup(groupId, etudiantId);
            return ResponseEntity.ok( result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/{groupId}/etudiants/{etudiantId}")
    public ResponseEntity<?> removeEtudiantFromGroup(@PathVariable Long groupId, @PathVariable Long etudiantId) {
        return ResponseEntity.ok( groupsService.removeEtudiantFromGroup(groupId, etudiantId));
    }


    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<Groups>> getGroupsByUserId(@PathVariable Long userId) {
        User user = userService.getUserById(userId);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        List<Groups> userGroups = user.getGroups();
        return ResponseEntity.ok(userGroups);
    }

    @GetMapping("/by-formateur/{formateurId}")
    public ResponseEntity<List<Groups>> getGroupsByFormateurId(@PathVariable Long formateurId) {
        List<Groups> groups = groupsService.getGroupsByFormateurId(formateurId);
        return new ResponseEntity<>(groups, HttpStatus.OK);
    }
    
   /* @GetMapping("/getCounMembers/{id}")
    public ResponseEntity<?> getCounMembersByGroupId(@PathVariable("id") Long id){
        Integer size = groupsService.getCountMembersByGroupId(id);
		return ResponseEntity.ok(size);
   }*/

    @GetMapping("/getGroupsByStudentId/{id}")
    public ResponseEntity<?> getGroupsByStudentId(@PathVariable("id") Long id){
    	try {
    		List<Groups> groups = groupsService.getGroupsByStudentId(id);
    		return ResponseEntity.ok(groups);
    	}catch(Exception e) {
    		System.err.println(e.getMessage());
    		return ResponseEntity.ok("Error while fetching data");
    	}
    }


}
