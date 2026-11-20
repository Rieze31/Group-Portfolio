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
            attachPhionaPortfolioToMemberThree();
            removeLegacyMembers();
            seedMemberIfMissing(member(0, "santos", "santos", "Althea Lei Santos", "BSIT STUDENT",
                    "Navotas, Philippines", OPEN, "#b49cf0", "PORTFOLIO INSIDE", "Figma", "React", "Git"));
            seedMemberIfMissing(member(1, "timbas", "timbas", "Carlo Timbas", "BSIT STUDENT",
                    "Navotas, Philippines", OPEN, "#3fb0a6", "PORTFOLIO INSIDE", "Java", "Spring Boot", "React"));
            seedMemberIfMissing(memberThree(2));
            seedMemberIfMissing(member(3, "venzon", "venzon", "Rieze Andrei Venzon", "BSIT STUDENT",
                    "Manila, Philippines", OPEN, "#ff6a4d", "OPEN TO AMBITIOUS PROBLEMS", "React", "Spring Boot", "Java"));
            updateMember("santos", "Althea Lei Santos", "BSIT STUDENT", "Navotas, Philippines");
            updateMember("timbas", "Carlo Timbas", "BSIT STUDENT", "Navotas, Philippines");
            updateMember("m3", "Phiona Eunice Garcia", "BSIT STUDENT", "Navotas, Philippines");
            updateMember("venzon", "Rieze Andrei Venzon", "BSIT STUDENT", "Manila, Philippines");
            repo.findById("m4").ifPresent(member -> {
                if (!"Piolo Pascual".equals(member.getName())) {
                    member.setName("Piolo Pascual");
                    repo.save(member);
                }
            });
            seedGuest(4, "bella", "garcia", "Bella Padilla", "Same name energy, different portfolio.", "#f29bb6");
            seedGuest(5, "liza", "santos", "Rose", "A little plot twist, with a portfolio inside.", "#e9b93c");
            seedGuest(6, "donny", "timbas", "Piolo Pascual", "Plot twist: swipe right to meet the developer.", "#7cc99a");
            seedGuest(7, "dwight", "venzon", "Dwight Ramos", "Plot twist: not who you think. Click to find out.", "#ffa24d");
            return;
        }

        repo.saveAll(List.of(
                // cards 1-4: the real members (portfolio = their own id)
                member(0, "santos", "santos", "Althea Lei Santos", "BSIT STUDENT", "Navotas, Philippines", OPEN, "#b49cf0", "PORTFOLIO INSIDE", "Figma", "React", "Git"),
                member(1, "timbas", "timbas", "Carlo Timbas", "BSIT STUDENT", "Navotas, Philippines", OPEN, "#3fb0a6", "PORTFOLIO INSIDE", "Java", "Spring Boot", "React"),
                memberThree(2),
                member(3, "venzon", "venzon", "Rieze Andrei Venzon", "BSIT STUDENT", "Manila, Philippines", OPEN, "#ff6a4d", "OPEN TO AMBITIOUS PROBLEMS", "React", "Spring Boot", "Java"),

                // cards 5-8: joke cards that open the real portfolios
                member(4, "bella", "garcia", "Bella Padilla", "MYSTERY GUEST", "Manila, PH", "Same name energy, different portfolio.", "#f29bb6", "PORTFOLIO INSIDE", "Surprise", "Plot twist", "Open me"),
                member(5, "liza", "santos", "Rose", "MYSTERY GUEST", "Manila, PH", "A little plot twist, with a portfolio inside.", "#e9b93c", "PORTFOLIO INSIDE", "Surprise", "Plot twist", "Open me"),
                member(6, "donny", "timbas", "Piolo Pascual", "MYSTERY GUEST", "Manila, PH", "Plot twist: swipe right to meet the developer.", "#7cc99a", "PORTFOLIO INSIDE", "Surprise", "Plot twist", "Open me"),
                member(7, "dwight", "venzon", "Dwight Ramos", "MYSTERY GUEST", "Manila, PH", "Plot twist: not who you think. Click to find out.", "#ffa24d", "PORTFOLIO INSIDE", "Surprise", "Plot twist", "Open me")
        ));
    }

    private void removeLegacyMembers() {
        repo.deleteAllById(List.of("m2", "m4", "m5", "m6", "m7"));
    }

    private void seedMemberIfMissing(Member member) {
        if (!repo.existsById(member.getId())) repo.save(member);
    }

    private void seedGuest(int order, String id, String portfolio, String name, String quote, String color) {
        repo.save(member(order, id, portfolio, name, "MYSTERY GUEST", "Manila, PH", quote,
                color, "PORTFOLIO INSIDE", "Surprise", "Plot twist", "Open me"));
    }

    private void updateMember(String id, String name, String role, String location) {
        repo.findById(id).ifPresent(member -> {
            member.setName(name);
            member.setRole(role);
            member.setLocation(location);
            repo.save(member);
        });
    }

    private void attachPhionaPortfolioToMemberThree() {
        var memberThree = repo.findById("m3");
        var phiona = repo.findById("garcia");

        if (memberThree.isPresent()) {
            Member member = memberThree.get();
            member.setPortfolio("garcia");
            repo.saveAndFlush(member);
            phiona.ifPresent(repo::delete);
            return;
        }

        if (phiona.isEmpty()) return;

        repo.delete(phiona.get());
        int order = 0;
        for (Member member : repo.findAllByOrderBySortOrderAsc()) {
            if (order == 2) repo.save(memberThree(order++));
            member.setSortOrder(order++);
            repo.save(member);
        }
        if (order <= 2) repo.save(memberThree(order));
    }

    private Member memberThree(int order) {
        return member(order, "m3", "garcia", "Phiona Eunice Garcia", "BSIT STUDENT", "Navotas, Philippines",
                "Pixels are a love language.", "#b49cf0", "COFFEE-POWERED", "React", "Tailwind", "Any");
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
