package com.esprit.springjwt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

	 private final SimpMessagingTemplate messagingTemplate;
	 
	 	@Autowired
	    public WebSocketService(final SimpMessagingTemplate messagingTemplate) {
	        this.messagingTemplate = messagingTemplate;
	    }

	    public void sendMessage(final String topicSuffix) {
	        messagingTemplate.convertAndSend("/topic/" + topicSuffix, "Default message from our WS service");
	    }

	    public void sendMessage(final String topicSuffix, final String payload) {
	        messagingTemplate.convertAndSend("/topic/" + topicSuffix, payload);
	    }
	    
	    public void notifyFront(String topic) {
	    	if(topic == null) {
	    		System.err.println("error to get topic");
	    	}
	    	sendMessage(topic);
	    }
}
