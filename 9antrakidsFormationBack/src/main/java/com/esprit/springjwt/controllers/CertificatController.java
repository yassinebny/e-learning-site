package com.esprit.springjwt.controllers;

import com.esprit.springjwt.entity.*;
import com.esprit.springjwt.repository.CertificatRepository;
import com.esprit.springjwt.repository.EtudiantRepository;
import com.esprit.springjwt.repository.GroupsRepository;
import com.esprit.springjwt.repository.UserRepository;
import com.esprit.springjwt.service.CertificateService;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;
import org.json.simple.parser.JSONParser;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/certif")

public class CertificatController {
    @Autowired
    protected GroupsRepository groupsRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private CertificatRepository certificatRepository;
    @Autowired
    private CertificateService certificateService;

    @Value("${files.folder}")
    String filesFolder;

    private static String rootPath = ClassPathResource.class.getClassLoader().getResource("").getPath();

    @PostMapping("/Generer")
    public void genererCertificat(@RequestBody String c)throws RuntimeException, IOException, DocumentException
    {
        try {

            Object obj = new JSONParser().parse(c);
            JSONObject jo = (JSONObject) obj;

            String liste = (String) jo.get("liste");
            String periode = (String) jo.get("periode");
            String nom_formation = (String) jo.get("nom_formation");
            String month = (String) jo.get("month");
            String date = (String) jo.get("date");



            Random random = new Random();
            int randomNumber = random.nextInt(9999999) + 1;
            File f = new File(filesFolder + "\\Certifications\\"+nom_formation+" "+month +  " " + randomNumber );
            if (f.mkdir() == true) {
                System.out.println("Directory has been created successfully");
            }
            else {
                System.out.println("Directory cannot be created");
            }


            // for (String s: liste.split(",")) {
            for (String s: liste.split("\n")) {
                s = s.replace("\n", "").replace("\r", "");
                String pdfname = f.getAbsolutePath()+"\\"+s+ ".pdf";

                Document document = new Document();
                document.setPageSize(PageSize.A4.rotate());

                try {
                    FileOutputStream fo = new FileOutputStream(new File(pdfname));
                    PdfWriter writer = PdfWriter.getInstance(document, fo);

                    document.open();

                    PdfContentByte canvas = writer.getDirectContentUnder();
                    Image image = Image.getInstance("src/main/resources/certif2.jpg");
                    image.scaleAbsolute(PageSize.A4.rotate()); image.setAbsolutePosition(0, 0);
                    canvas.addImage(image);


                    float pos=(document.getPageSize().getWidth()/2)-(s.length()*18/2);
                    FixText(s,"savoyeplain.ttf", "Savoye", pos,240, writer, 60);


                    certificate_footer(writer, s,periode,nom_formation,month);

                    FixText(date,"poppins.regular.ttf", "Poppins",280,100, writer, 13);

//                    Etudiant e = Etudiantrepository.findByName(s);
//
                    String str ="";
//
//                    if (e != null) {
//                        str="http://localhost:4200/profil/"+e.getIdEtudiant();
//
//                    }else {
//                        str="https://www.facebook.com/9antra.tn/";
//                    }
                    str="https://www.facebook.com/9antra.tn/";
                    //Step-5: Create QR Code by using BarcodeQRCode Class
                    BarcodeQRCode my_code = new BarcodeQRCode(str, 100, 100, null);
                    //Step-6: Get Image corresponding to the input string
                    Image qr_image = my_code.getImage();
                    qr_image.setAbsolutePosition(70, 60);
                    //Step-7: Stamp the QR image into the PDF document
                    document.add(qr_image);
                    document.close();
                    writer.close();
                    fo.close();
                    System.out.println("Done");

                } catch (Exception e) {
                    e.printStackTrace();
                }

            }


            System.out.print(nom_formation);

        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }


    }

    @PostMapping("/Generer/{idgroupe}")
    public void genererCertificatForGroup(@PathVariable Long idgroupe, @RequestParam String month, @RequestParam String periode) throws RuntimeException, IOException, DocumentException {
        try {
            Groups group = groupsRepository.findById(idgroupe).orElseThrow(() -> new RuntimeException("Groupe introuvable"));

            Formation formation = group.getFormation();
            String nom_formation = formation.getNomFormation();

            List<User> users = group.getEtudiants();

            if (users.isEmpty()) {
                throw new RuntimeException("Aucun utilisateur n'est associé au groupe.");
            }

            if (group.isCertificatesGenerated()) {
                throw new RuntimeException("Certificates already generated for this group.");
            }

            for (User user : users) {
                // Vérifier si l'utilisateur a déjà un certificat
                if (user.getCertificats().isEmpty()) {
                    String fullName = user.getFirstName() + " " + user.getLastName();

                    String relativePath = "Certifications/" + nom_formation + " " + month + "/" + "_" + user.getId() + "_" + user.getFirstName() + "_" + user.getLastName() + ".pdf";
                    //String pdfname = "C:\\Users\\DELL\\Desktop\\The Bridge Front\\9antraFormationFrant\\src\\assets\\" + relativePath;
                    String pdfname = filesFolder + "\\" + relativePath;
                    //File f = new File("C:\\Users\\DELL\\Desktop\\The Bridge Front\\9antraFormationFrant\\src\\assets\\Certifications\\" + nom_formation + " " + month);
                    File f = new File(filesFolder + "\\Certifications\\" + nom_formation + " " + month);
                    if (f.mkdir()) {
                        System.out.println("Directory has been created successfully");
                    } else {
                        System.out.println("Directory cannot be created");
                    }
                    Document document = new Document();
                    document.setPageSize(PageSize.A4.rotate());

                    Certificat certificat = new Certificat();
                    certificat.setDate(LocalDateTime.now());
                    certificat.setPeriode(periode);
                    certificat.setMonth(month);
                    group.setCertificatesGenerated(true);

                    certificat.setUser(user); // Set the relationship between Certificat and User

                    try {
                    FileOutputStream fo = new FileOutputStream(new File(pdfname));
                    PdfWriter writer = PdfWriter.getInstance(document, fo);

                    document.open();

                    PdfContentByte canvas = writer.getDirectContentUnder();

                    Image image = Image.getInstance("src/main/resources/certif2.jpg");
                    image.scaleAbsolute(PageSize.A4.rotate());
                    image.setAbsolutePosition(0, 0);
                    canvas.addImage(image);

                    float pos = (document.getPageSize().getWidth() / 2) - (fullName.length() * 18 / 2);
                    FixText(fullName, "savoyeplain.ttf", "Savoye", pos, 240, writer, 60);

                    certificate_footer(writer, fullName, periode, nom_formation, month);

                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
                    String formattedDate = certificat.getDate().format(formatter);
                    FixText(formattedDate, "poppins.regular.ttf", "Poppins", 280, 100, writer, 13);

                    String str = "http://localhost:4200/student/profile/" + user.getId(); // Utiliser l'ID de l'utilisateur pour le lien QR
                    BarcodeQRCode my_code = new BarcodeQRCode(str, 100, 100, null);
                    Image qr_image = my_code.getImage();
                    qr_image.setAbsolutePosition(70, 60);
                    document.add(qr_image);

                    document.close();
                    writer.close();
                    fo.close();
                    System.out.println("Done");
                    String certificateLink = "http://localhost:4200/student/profile/" + user.getId();
                    sendEmailWithAttachment(user.getUsername(), pdfname, fullName, certificateLink);

                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    // Set the relationship between Certificat and User
                    certificat.setPath(relativePath);
                    certificat.setUserOrGroupId(group.getId()); // ou certificat.setUserOrGroupId(group.getId());

                    certificatRepository.save(certificat);
                    System.out.print(nom_formation);
                } else {
                    System.out.println("Certificat already exists for user: " + user.getFirstName() + " " + user.getLastName());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }




    /***********user*********/
    @PostMapping("/Generer/{idgroupe}/userone/{iduser}")
    public void genererCertificatForUserOneInGroup(
            @PathVariable Long idgroupe,
            @PathVariable Long iduser,
            @RequestParam String month,
            @RequestParam String periode) throws RuntimeException, IOException, DocumentException {
        try {
            Groups group = groupsRepository.findById(idgroupe)
                    .orElseThrow(() -> new RuntimeException("Groupe introuvable"));
            areAllUsersCertified(group); // Appel pour afficher le compte dans la console

            User user = userRepository.findById(iduser)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
            if (!user.getCertificats().isEmpty()) {
                throw new RuntimeException("Cet utilisateur a déjà une certification.");
            }

            Formation formation = group.getFormation();
            String nom_formation = formation.getNomFormation();

            String fullName = user.getFirstName() + " " + user.getLastName();

            String relativePath = "Certifications/" + nom_formation + " " + month + "/" +
                    "_" + user.getId() + "_" + user.getFirstName() + "_" + user.getLastName() + ".pdf";
            String pdfname = filesFolder + "\\" + relativePath;
            File f = new File(filesFolder + "\\Certifications\\" + nom_formation + " " + month);

            if (f.mkdir()) {
                System.out.println("Directory has been created successfully");
            } else {
                System.out.println("Directory cannot be created");
            }
            Document document = new Document();
            document.setPageSize(PageSize.A4.rotate());

            Certificat certificat = new Certificat();
            certificat.setDate(LocalDateTime.now());
            certificat.setPeriode(periode);
            certificat.setMonth(month);
            certificat.setUserOrGroupId(group.getId()); // ou certificat.setUserOrGroupId(group.getId());

            certificat.setUser(user); // Set the relationship between Certificat and User

            try {
                FileOutputStream fo = new FileOutputStream(new File(pdfname));
                PdfWriter writer = PdfWriter.getInstance(document, fo);

                document.open();

                PdfContentByte canvas = writer.getDirectContentUnder();

                Image image = Image.getInstance("src/main/resources/certif2.jpg");
                image.scaleAbsolute(PageSize.A4.rotate());
                image.setAbsolutePosition(0, 0);
                canvas.addImage(image);

                float pos = (document.getPageSize().getWidth() / 2) - (fullName.length() * 18 / 2);
                FixText(fullName, "savoyeplain.ttf", "Savoye", pos, 240, writer, 60);

                certificate_footer(writer, fullName, periode, nom_formation, month);

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
                String formattedDate = certificat.getDate().format(formatter);
                FixText(formattedDate, "poppins.regular.ttf", "Poppins", 280, 100, writer, 13);

                String str = "http://localhost:4200/student/profile/" + user.getId(); // Utiliser l'ID de l'utilisateur pour le lien QR
                BarcodeQRCode my_code = new BarcodeQRCode(str, 100, 100, null);
                Image qr_image = my_code.getImage();
                qr_image.setAbsolutePosition(70, 60);
                document.add(qr_image);

                document.close();
                writer.close();
                fo.close();
                System.out.println("Done");
                String certificateLink = "http://localhost:4200/student/profile/" + user.getId();
                sendEmailWithAttachment(user.getUsername(), pdfname, fullName, certificateLink);

            } catch (Exception e) {
                e.printStackTrace();
            }
            // Set the relationship between Certificat and User
            certificat.setPath(relativePath);
            if (areAllUsersCertified(group)) {
                // Réagir en conséquence (par exemple, renvoyer une réponse indiquant que les utilisateurs n'ont pas de certification)
                String responseMessage = "wfew";
                System.out.println(responseMessage);
                // Ici, vous pouvez retourner un code d'erreur HTTP approprié et un message JSON, par exemple
                // Vous devez également adapter cela à la structure de réponse que votre API utilise
            group.setCertificatesGenerated(true);            }

            groupsRepository.save(group);

            certificat.setUserOrGroupId(group.getId()); // ou certificat.setUserOrGroupId(group.getId());

            System.out.print(nom_formation);
            certificatRepository.save(certificat);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public boolean areAllUsersCertified(Groups group) {
        List<User> usersInGroup = group.getEtudiants();
        int certifiedUserCount = 1;

        for (User user : usersInGroup) {
            if (!user.getCertificats().isEmpty()) {
                certifiedUserCount++;
            }
        }

        System.out.println(certifiedUserCount + "/" + usersInGroup.size() + " " + (certifiedUserCount == usersInGroup.size()));

        return certifiedUserCount == usersInGroup.size();
    }





    private void sendEmailWithAttachment(String toEmail, String attachmentPath, String fullName, String certificateLink) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        try {
            helper.setTo(toEmail);
            helper.setSubject("Your Certificate");

            // Set the email body
            String emailBody = "Hello " + fullName + ",\n\n" +
                    "Congratulations! Your certificate has been generated.\n" +
                    "You can download your certificate using the link below:\n\n" +
                    certificateLink + "\n\n" +
                    "Best regards,\n" +
                    "Your Certificate Team";

            helper.setText(emailBody);

            // Attach the certificate PDF
            FileSystemResource file = new FileSystemResource(new File(attachmentPath));
            helper.addAttachment("Certificate.pdf", file);

            javaMailSender.send(message);
            System.out.println("Email sent with certificate to: " + toEmail);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }


    private static void FixText (String text, String fontfile, String fontname,float x, int y, PdfWriter writer,
                                 int size){
        PdfContentByte cb = writer.getDirectContent();


        //FontFactory.register("C:\\Users\\DELL\\Desktop\\Certif\\backend\\src\\main\\resources\\fonts\\" + fontfile);
        FontFactory.register(rootPath + "fonts/" + fontfile);
        Font textFont = FontFactory.getFont(fontname, BaseFont.IDENTITY_H,
                BaseFont.EMBEDDED, 10);
        BaseFont bf = textFont.getBaseFont();

        cb.saveState();
        cb.beginText();
        cb.moveText(x, y);
        cb.setFontAndSize(bf, size);
        cb.showText(text);
        cb.endText();
        cb.restoreState();
    }
    private static void certificate_footer(PdfWriter writer, String name, String periode, String formation, String month ) {

        PdfContentByte cb = writer.getDirectContent();


        //FontFactory.register("C:\\Users\\DELL\\Desktop\\Certif\\backend\\src\\main\\resources\\fonts\\Poppins-Thin.ttf");
        FontFactory.register(rootPath + "fonts/Poppins-Thin.ttf");
        Font textFont = FontFactory.getFont("Poppins Thin", BaseFont.IDENTITY_H,
                BaseFont.EMBEDDED, 10);
        BaseFont bf = textFont.getBaseFont();
        //FontFactory.register("C:\\Users\\DELL\\Desktop\\Certif\\backend\\src\\main\\resources\\fonts\\poppins.regular.ttf");
        FontFactory.register(rootPath + "fonts/poppins.regular.ttf");
        Font textFont2 = FontFactory.getFont("Poppins", BaseFont.IDENTITY_H,
                BaseFont.EMBEDDED, 10);
        BaseFont bf2 = textFont2.getBaseFont();

        cb.saveState();
        cb.beginText();
        cb.moveText(180, 185);
        cb.setFontAndSize(bf, 14);
        String begin = "This is to certify that";
        cb.showText(begin);
        cb.endText();

        cb.beginText();
        cb.setFontAndSize(bf2, 14);
        float pos_name = 180+cb.getEffectiveStringWidth(begin, false);
        cb.moveText(pos_name, 185);
        cb.showText(name);
        cb.endText();

        cb.beginText();
        cb.setFontAndSize(bf, 14);
        float pos_text2 = pos_name+cb.getEffectiveStringWidth(name, false);
        cb.moveText(pos_text2 + 10, 185);
        String next ="successfully completed ";
        cb.showText(next);
        cb.endText();


        cb.beginText();
        cb.setFontAndSize(bf2, 14);
        float pos_mot2 = pos_text2 +cb.getEffectiveStringWidth(next, false);
        cb.moveText(pos_mot2 + 7, 185);
        cb.showText(periode);
        cb.endText();

        cb.beginText();
        cb.moveText(180,165);
        cb.setFontAndSize(bf, 14);
        String of = "of";
        cb.showText(of);
        cb.endText();

        cb.beginText();
        cb.setFontAndSize(bf2, 14);
        float pos_formation = 180+cb.getEffectiveStringWidth(of, false);
        cb.moveText(pos_formation + 7, 165);
        cb.showText(formation);
        cb.endText();

        cb.beginText();
        cb.setFontAndSize(bf, 14);
        float pos_text3 = pos_formation+cb.getEffectiveStringWidth(formation, false);
        cb.moveText(pos_text3 + 20, 165);
        String next2 = "training and coaching on";
        cb.showText(next2);
        cb.endText();

        cb.beginText();
        cb.setFontAndSize(bf2, 14);
        float pos_month = pos_text3+cb.getEffectiveStringWidth(next2, false);
        cb.moveText(pos_month + 20, 165);
        cb.showText(month);
        cb.endText();

        cb.restoreState();
    }






    private void deleteCertificatFiles(String pathToDelete) {
        try {
            Path directoryPath = Paths.get(pathToDelete);
            Files.walk(directoryPath)
                    .sorted((p1, p2) -> -p1.compareTo(p2)) // Delete files in reverse order (deepest first)
                    .forEach(p -> {
                        try {
                            Files.delete(p);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    /***hedhi**/
    @DeleteMapping("/Supprimer/{idgroupe}")
    public ResponseEntity<String> supprimerCertificatsForGroup(@PathVariable Long idgroupe) {
        try {
            Groups group = groupsRepository.findById(idgroupe).orElseThrow(() -> new RuntimeException("Groupe introuvable"));
            Formation formation = group.getFormation();
            String nom_formation = formation.getNomFormation();
            List<User> users = group.getEtudiants(); // Assuming "getEtudiants()" returns the list of users associated with the group
group.setCertificatesGenerated(false);
            if (users.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            for (User user : users) {
                List<Certificat> certificats = certificatRepository.findByUser(user); // Assuming "findByUser" is the correct method in your repository
                for (Certificat certificat : certificats) {
                    String pathToDelete = filesFolder + "\\Certifications\\" + nom_formation + " " + certificat.getMonth();

                    deleteCertificatFiles(pathToDelete);
                    certificatRepository.delete(certificat);
                }
            }

            return ResponseEntity.ok("Certificats deleted successfully for the group: " + idgroupe);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting certificats.");
        }
    }
    /**** hedhi ****/
    @PutMapping("/ModifierCertificats/{idgroupe}")
    public ResponseEntity<String> modifierCertificatsForGroup(@PathVariable Long idgroupe, @RequestParam String periode, @RequestParam String month) {
        try {
            Groups group = groupsRepository.findById(idgroupe).orElseThrow(() -> new RuntimeException("Groupe introuvable"));

            List<User> users = group.getEtudiants();

            if (users.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            for (User user : users) {
                String fullName = user.getFirstName() + " " + user.getLastName();
                Formation formation = group.getFormation();
                String nom_formation = formation.getNomFormation();

                String relativePath = "Certifications/" + nom_formation + " " + month + "/" + "_" + user.getId() + "_" + user.getFirstName() + "_" + user.getLastName() + ".pdf";
                String pdfname = filesFolder + "\\" + relativePath;
                File pdfFile = new File(pdfname);

                List<Certificat> certificats = certificatRepository.findByUser(user);
                for (Certificat certificat : certificats) {
                    String oldPath = certificat.getPath();
                    String newPath = oldPath.replace(certificat.getMonth().trim(), month.trim());

                    // Update periode and month in the certificate
                    certificat.setPeriode(periode);

                    // Check if the new month is different from the existing month
                    if (!month.equals(certificat.getMonth())) {
                        certificat.setMonth(month);

                        // Update certificate path if month changed
                        certificat.setPath(newPath);

                        // Delete the old folder if it exists
                        File oldFolder = new File(filesFolder + "\\" + oldPath).getParentFile();
                        if (oldFolder.exists() && oldFolder.isDirectory()) {
                            File[] files = oldFolder.listFiles();
                            if (files != null) {
                                for (File file : files) {
                                    file.delete();
                                }
                            }
                            oldFolder.delete();
                        }

                        // Create the new folder
                        pdfFile.getParentFile().mkdirs();
                    }

                    Document document = new Document();
                    document.setPageSize(PageSize.A4.rotate());
                    // Save the modified certificate


                    try {
                        FileOutputStream fo = new FileOutputStream(new File(pdfname));
                        PdfWriter writer = PdfWriter.getInstance(document, fo);

                        document.open();

                        PdfContentByte canvas = writer.getDirectContentUnder();

                        Image image = Image.getInstance("src/main/resources/certif2.jpg");
                        image.scaleAbsolute(PageSize.A4.rotate());
                        image.setAbsolutePosition(0, 0);
                        canvas.addImage(image);

                        float pos = (document.getPageSize().getWidth() / 2) - (fullName.length() * 18 / 2);
                        FixText(fullName, "savoyeplain.ttf", "Savoye", pos, 240, writer, 60);

                        certificate_footer(writer, fullName, periode, nom_formation, month);

                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
                        String formattedDate = certificat.getDate().format(formatter);
                        FixText(formattedDate, "poppins.regular.ttf", "Poppins", 280, 100, writer, 13);

                        String str = "http://localhost:4200/student/profile/" + user.getId(); // Utiliser l'ID de l'utilisateur pour le lien QR
                        BarcodeQRCode my_code = new BarcodeQRCode(str, 100, 100, null);
                        Image qr_image = my_code.getImage();
                        qr_image.setAbsolutePosition(70, 60);
                        document.add(qr_image);

                        document.close();
                        writer.close();
                        fo.close();
                        System.out.println("Done");
                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                    certificat.setPath(relativePath);
                    Certificat savedCertificat = certificatRepository.save(certificat);
                    System.out.println("Updated certificat path: " + savedCertificat.getPath());
                }
            }

            return ResponseEntity.ok("Certificats updated successfully for the group: " + idgroupe);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating certificats.");
        }
    }
    @PutMapping("/Modifier/{idgroupe}/userone/{iduser}")
    public ResponseEntity<String> modifierCertificatForUserInGroup(
            @PathVariable Long idgroupe,
            @PathVariable Long iduser,
            @RequestParam String month,
            @RequestParam String periode) {
        try {
            Groups group = groupsRepository.findById(idgroupe)
                    .orElseThrow(() -> new RuntimeException("Groupe introuvable"));

            User user = userRepository.findById(iduser)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

            List<Certificat> certificats = certificatRepository.findByUser(user);

            if (certificats.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            for (Certificat certificat : certificats) {
                String fullName = user.getFirstName() + " " + user.getLastName();
                Formation formation = group.getFormation();
                String nom_formation = formation.getNomFormation();

                String relativePath = "Certifications/" + nom_formation + " " + month + "/" +
                        "_" + user.getId() + "_" + user.getFirstName() + "_" + user.getLastName() + ".pdf";
                String pdfname = filesFolder + "\\" + relativePath;
                File pdfFile = new File(pdfname);

                // Update periode and month in the certificate
                certificat.setPeriode(periode);

                // Check if the new month is different from the existing month
                if (!month.equals(certificat.getMonth())) {
                    String oldPath = certificat.getPath();
                    String newPath = oldPath.replace(certificat.getMonth().trim(), month.trim());

                    certificat.setMonth(month);

                    // Update certificate path if month changed
                    certificat.setPath(newPath);

                    // Delete the old file if it exists
                    File oldFile = new File(filesFolder + "\\" + oldPath);
                    if (oldFile.exists() && oldFile.isFile()) {
                        oldFile.delete();
                    }

                    // Create the new folder
                    pdfFile.getParentFile().mkdirs();
                }

                Document document = new Document();
                document.setPageSize(PageSize.A4.rotate());
                // Save the modified certificate

                try {
                    FileOutputStream fo = new FileOutputStream(new File(pdfname));
                    PdfWriter writer = PdfWriter.getInstance(document, fo);

                    document.open();

                    PdfContentByte canvas = writer.getDirectContentUnder();

                    Image image = Image.getInstance("src/main/resources/certif2.jpg");
                    image.scaleAbsolute(PageSize.A4.rotate());
                    image.setAbsolutePosition(0, 0);
                    canvas.addImage(image);

                    float pos = (document.getPageSize().getWidth() / 2) - (fullName.length() * 18 / 2);
                    FixText(fullName, "savoyeplain.ttf", "Savoye", pos, 240, writer, 60);

                    certificate_footer(writer, fullName, periode, nom_formation, month);

                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
                    String formattedDate = certificat.getDate().format(formatter);
                    FixText(formattedDate, "poppins.regular.ttf", "Poppins", 280, 100, writer, 13);

                    String str = "http://localhost:4200/student/profile/" + user.getId(); // Utiliser l'ID de l'utilisateur pour le lien QR
                    BarcodeQRCode my_code = new BarcodeQRCode(str, 100, 100, null);
                    Image qr_image = my_code.getImage();
                    qr_image.setAbsolutePosition(70, 60);
                    document.add(qr_image);

                    document.close();    writer.close();
                    fo.close();
                    System.out.println("Done");
                } catch (Exception e) {
                    e.printStackTrace();
                }

                certificatRepository.save(certificat);
                System.out.println("Updated certificat path: " + certificat.getPath());
            }

            return ResponseEntity.ok("Certificat updated successfully for the user: " + iduser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the certificat.");
        }
    }
/****** periode tetmodifa ***/
    @PutMapping("/ModifierCertificatsUpdatePeriode/{idgroupe}")
    public ResponseEntity<String> modifierCertificatsForGroupUpdatePeriode(@PathVariable Long idgroupe, @RequestParam String newPeriode, @RequestParam String newMonth) {
        try {
            Groups group = groupsRepository.findById(idgroupe).orElseThrow(() -> new RuntimeException("Groupe introuvable"));

            List<User> users = group.getEtudiants();

            if (users.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            for (User user : users) {
                String fullName = user.getFirstName() + " " + user.getLastName();
                Formation formation = group.getFormation();
                String nom_formation = formation.getNomFormation();

                String relativePath = "Certifications/" + nom_formation + " " + newMonth + "/" +"_"+user.getId() +"_"+ user.getFirstName() +"_"+ user.getLastName() + ".pdf";
                String pdfname = filesFolder + "\\" + relativePath;
                File f = new File(filesFolder + "\\Certifications\\" + nom_formation + " " + newMonth);
             // Creates all directories if they don't exist

                if (f.mkdir()) {
                    System.out.println("Directory has been created successfully");
                } else {
                    System.out.println("Directory cannot be created");
                }
                Document document = new Document();
                document.setPageSize(PageSize.A4.rotate());
                List<Certificat> certificats = certificatRepository.findByUser(user);
                for (Certificat certificat : certificats) {
                    String oldPath = certificat.getPath();
                    String newPath = oldPath.replace(certificat.getMonth().trim(), newMonth.trim());

                    // Update periode and month in the certificate
                    certificat.setPeriode(newPeriode);
                    certificat.setMonth(newMonth);

                    // Update certificate path if month changed
                    if (!newMonth.equals(certificat.getMonth())) {
                        certificat.setPath(newPath);
                    }

                    // Save the modified certificate


                    try {
                        FileOutputStream fo = new FileOutputStream(new File(pdfname));
                        PdfWriter writer = PdfWriter.getInstance(document, fo);

                        document.open();

                        PdfContentByte canvas = writer.getDirectContentUnder();

                        Image image = Image.getInstance("src/main/resources/certif2.jpg");
                        image.scaleAbsolute(PageSize.A4.rotate());
                        image.setAbsolutePosition(0, 0);
                        canvas.addImage(image);

                        float pos = (document.getPageSize().getWidth() / 2) - (fullName.length() * 18 / 2);
                        FixText(fullName, "savoyeplain.ttf", "Savoye", pos, 240, writer, 60);

                        certificate_footer(writer, fullName, newPeriode, nom_formation, newMonth);

                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
                        String formattedDate = certificat.getDate().format(formatter);
                        FixText(formattedDate, "poppins.regular.ttf", "Poppins", 280, 100, writer, 13);

                        String str = "http://localhost:4200/student/profile/" + user.getId(); // Utiliser l'ID de l'utilisateur pour le lien QR
                        BarcodeQRCode my_code = new BarcodeQRCode(str, 100, 100, null);
                        Image qr_image = my_code.getImage();
                        qr_image.setAbsolutePosition(70, 60);
                        document.add(qr_image);

                        document.close();
                        writer.close();
                        fo.close();
                        System.out.println("Done");
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    certificat.setPath(relativePath);
                    Certificat savedCertificat = certificatRepository.save(certificat);
                    System.out.println("Updated certificat path: " + savedCertificat.getPath());
                }
            }

            return ResponseEntity.ok("Certificats updated successfully for the group: " + idgroupe);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating certificats.");
        }
    }
    @GetMapping("/check-generated/{groupId}")
    public ResponseEntity<Boolean> checkCertificatesGenerated(@PathVariable Long groupId) {
        boolean certificatesGenerated = certificateService.checkIfCertificatesGenerated(groupId);
        System.out.println("Certificates generated for group " + groupId + ": " + certificatesGenerated);
        return ResponseEntity.ok(certificatesGenerated);

    }
    @GetMapping("/values/{idgroupe}")
    public ResponseEntity<List<Certificat>> getCertificateValuesByGroupId(@PathVariable Long idgroupe) {
        List<Certificat> certificatValues = certificateService.getCertificatByGroupId(idgroupe);
        if (!certificatValues.isEmpty()) {
            return ResponseEntity.ok(certificatValues);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/valueswe/{idgroupe}")
    public ResponseEntity<Certificat> getCertificateValuesByGroupIdwe(@PathVariable Long idgroupe) {
        List<Certificat> certificatValues = certificateService.getCertificatByGroupId(idgroupe);

        if (!certificatValues.isEmpty()) {
            // Assuming you have a method to extract periode and month from the Certificat object
            String periode = certificatValues.get(0).getPeriode();
            String month = certificatValues.get(0).getMonth();

            Certificat certificatDTO = new Certificat(periode, month);

            return ResponseEntity.ok(certificatDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/UserCertificates/{userId}")
    public ResponseEntity<List<Certificat>> getUserCertificates(
            @PathVariable Long userId
    ) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Certificat> userCertificates = user.getCertificats();

            return ResponseEntity.ok(userCertificates);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/UserCertificatesFormation/{userId}")
    public ResponseEntity<List<String>> getUserCertificatesFormationNames(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Certificat> userCertificates = user.getCertificats();
            Set<String> formationNames = new HashSet<>();

            for (Certificat certificat : userCertificates) {
                String path = certificat.getPath();
                String formationName = extractFormationNameFromPath(path);
                formationNames.add(formationName);
            }

            return ResponseEntity.ok(new ArrayList<>(formationNames));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String extractFormationNameFromPath(String path) {
        int startIndex = path.indexOf("Certifications/") + "Certifications/".length();
        int endIndex = path.indexOf("/", startIndex);
        if (endIndex != -1) {
            return path.substring(startIndex, endIndex);
        }
        return "";
    }

    @GetMapping("/ShareCertificateOnLinkedIn/{certificatId}")
    public ResponseEntity<String> shareCertificateOnLinkedIn(@PathVariable Long certificatId) {
        try {
            Certificat certificat = certificatRepository.findById(certificatId)
                    .orElseThrow(() -> new RuntimeException("Certificat not found"));

            String shareUrl = "https://www.linkedin.com/sharing/share-offsite/?url="
                    + URLEncoder.encode(certificat.getPath(), "UTF-8");

            return ResponseEntity.ok(shareUrl);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/Supprimer/{idgroupe}/user/{iduser}")
    public ResponseEntity<String> supprimerUserFromGroup(@PathVariable Long idgroupe, @PathVariable Long iduser) {
        try {
            Groups group = groupsRepository.findById(idgroupe).orElseThrow(() -> new RuntimeException("Groupe introuvable"));
            User user = userRepository.findById(iduser).orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

            List<Certificat> certificats = certificatRepository.findByUser(user);
            for (Certificat certificat : certificats) {
                String pdfPathToDelete = filesFolder + "\\" + certificat.getPath();
                deleteCertificatFile(pdfPathToDelete); // Supprime le fichier PDF

                certificatRepository.delete(certificat);
            }
            group.setCertificatesGenerated(false);

            group.getEtudiants().remove(user);
            groupsRepository.save(group);

            return ResponseEntity.ok("User and associated certificats deleted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the user and certificats.");
        }
    }

    private void deleteCertificatFile(String pdfFilePath) {
        File pdfFile = new File(pdfFilePath);
        if (pdfFile.exists() && pdfFile.isFile()) {
            pdfFile.delete();
        }
    }

}
