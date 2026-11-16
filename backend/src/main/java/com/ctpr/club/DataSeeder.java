package com.ctpr.club;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {
    private static final String BLUE = "linear-gradient(160deg,#2d8de0,#9b8cff)";
    private static final String NAVY = "linear-gradient(160deg,#003f66,#002a45)";
    private static final String P1 = "linear-gradient(135deg,#1c2a3a,#4a3f2e)";
    private static final String P2 = "linear-gradient(135deg,#0d2b45,#1f6f8b)";
    private static final String SOON = "Portfolio coming soon. Replace this text with your story.";
    private static final String OPEN = "Portfolio inside. Tap to open.";

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

        repo.saveAll(List.of(
                // cards 1-4: the real members (portfolio = their own id)
                member(0, "garcia", "garcia", "Phiona Garcia", "BSIT STUDENT", "Manila, PH", OPEN, "#7fb2e8", "PORTFOLIO INSIDE", "React", "Java", "Git"),
                member(1, "santos", "santos", "Althea Lei Santos", "BSIT STUDENT", "Manila, PH", OPEN, "#b49cf0", "PORTFOLIO INSIDE", "Figma", "React", "Git"),
                member(2, "timbas", "timbas", "Carlo Timbas", "FULL-STACK DEVELOPER", "Manila, PH", OPEN, "#3fb0a6", "PORTFOLIO INSIDE", "Java", "Spring Boot", "React"),
                member(3, "venzon", "venzon", "Rieze Andrei Venzon", "FULL-STACK DEVELOPER", "Manila, PH", OPEN, "#ff6a4d", "OPEN TO AMBITIOUS PROBLEMS", "React", "Spring Boot", "Java"),

                // cards 5-8: joke cards that open the real portfolios
                member(4, "bella", "garcia", "Bella Padilla", "MYSTERY GUEST", "Manila, PH", "Same name energy, different portfolio.", "#f29bb6", "PORTFOLIO INSIDE", "Surprise", "Plot twist", "Open me"),
                member(5, "liza", "santos", "Liza Soberano", "MYSTERY GUEST", "Manila, PH", "Is it who you think? Only one way to find out.", "#e9b93c", "PORTFOLIO INSIDE", "Surprise", "Plot twist", "Open me"),
                member(6, "donny", "timbas", "Donny Pangilinan", "MYSTERY GUEST", "Manila, PH", "Do not judge a card by its name.", "#7cc99a", "PORTFOLIO INSIDE", "Surprise", "Plot twist", "Open me"),
                member(7, "dwight", "venzon", "Dwight Ramos", "MYSTERY GUEST", "Manila, PH", "Plot twist: not who you think. Click to find out.", "#ffa24d", "PORTFOLIO INSIDE", "Surprise", "Plot twist", "Open me")
        ));
    }

    private Member member(int order, String id, String portfolio, String name, String role, String location,
                          String quote, String color, String caption, String... tags) {
        Member m = new Member();
        m.setId(id);
        m.setPortfolio(portfolio);
        m.setSortOrder(order);
        m.setName(name);
        m.setRole(role);
        m.setLocation(location);
        m.setQuote(quote);
        m.setColor(color);
        m.setCaption(caption);
        m.setMatchPercent(98 - order * 2);
        m.setBio(SOON);
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