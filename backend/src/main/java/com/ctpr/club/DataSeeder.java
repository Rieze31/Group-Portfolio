package com.ctpr.club;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/** Fills the database on first run. Edit the members below, delete the ./data folder, and restart to re-seed. */
@Component
public class DataSeeder implements CommandLineRunner {
    private static final String BLUE = "linear-gradient(160deg,#003F66,#002A45)";
    private static final String NAVY = "linear-gradient(160deg,#002A45,#001B2B)";
    private static final String P1 = "linear-gradient(135deg,#FFB915,#003F66)";
    private static final String P2 = "linear-gradient(135deg,#FFD358,#002A45)";

    private final MemberRepository repo;

    public DataSeeder(MemberRepository repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) {
        if (repo.count() > 0) {
            repo.findById("m4").ifPresent(member -> {
                if (!"Piolo Pascual".equals(member.getName())) {
                    member.setName("Piolo Pascual");
                    repo.save(member);
                }
            });
            return;
        }

        Member dwight = member(0, "dwight", "Dwight Ramos", "FULL-STACK DEVELOPER", "Manila, PH",
                "“I build the whole thing, then fuss over the corner radius.”", "#EEA233", "OPEN TO AMBITIOUS PROBLEMS",
                "3rd year BSIT student at Pamantasan ng Lungsod ng Maynila, exploring frontend and backend development with React, Spring Boot, Java, and Tailwind.",
                "React", "Spring Boot", "Java");
        dwight.setSlides(new ArrayList<>(List.of(
                new Slide("Coding sessions", "Late nights exploring Java, Spring Boot, and React.", "linear-gradient(160deg,#EEA233,#2b2622)"),
                new Slide("Campus life", "3rd year BSIT student at Pamantasan ng Lungsod ng Maynila.", BLUE),
                new Slide("Off the clock", "When I’m not coding, I’m on the court.", BLUE))));

        String soon = "Portfolio coming soon. Replace this text with your story.";
        repo.saveAll(List.of(
                dwight,
                member(1, "m2", "Rosé", "UI/UX DESIGNER", "Quezon City, PH", "“Making complicated tools feel suspiciously simple.”", "#003F66", "FLUENT IN FIGMA", soon, "Figma", "Research", "Systems"),
                member(2, "m3", "Bela Padilla", "FRONTEND DEVELOPER", "Manila, PH", "“Pixels are a love language.”", "#FFD358", "COFFEE-POWERED", soon, "React", "Tailwind", "A11y"),
                member(3, "m4", "Piolo Pascual", "BACKEND DEVELOPER", "Makati, PH", "“If it scales quietly, I did my job.”", "#002A45", "BUILDS IN PUBLIC", soon, "Java", "APIs", "SQL")
        ));
    }

    private Member member(int order, String id, String name, String role, String location, String quote,
                          String color, String caption, String bio, String... tags) {
        Member m = new Member();
        m.setId(id);
        m.setSortOrder(order);
        m.setName(name);
        m.setRole(role);
        m.setLocation(location);
        m.setQuote(quote);
        m.setColor(color);
        m.setCaption(caption);
        m.setMatchPercent(98 - order * 2);
        m.setBio(bio);
        m.setTags(new ArrayList<>(Arrays.asList(tags)));
        m.setProjects(new ArrayList<>(List.of(
                new Project("Project A", tags[0] + " frontend. Details coming soon.", P1),
                new Project("Project B", "Built with " + tags[0] + " and " + tags[1] + ". Details coming soon.", P2))));
        m.setSlides(new ArrayList<>(List.of(
                new Slide("Workspace", "Where the work happens.", "linear-gradient(160deg," + color + ",#2b2622)"),
                new Slide("Campus life", "Life between classes.", BLUE),
                new Slide("Off the clock", "What I do for fun.", NAVY))));
        return m;
    }
}
