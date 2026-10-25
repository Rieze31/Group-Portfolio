package com.ctpr.club;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/** Fills the database on first run. Edit the members below, delete the ./data folder, and restart to re-seed. */
@Component
public class DataSeeder implements CommandLineRunner {
    private static final String GREEN = "linear-gradient(160deg,#0f6b5c,#6fcf97)";
    private static final String BLUE = "linear-gradient(160deg,#2d8de0,#9b8cff)";
    private static final String P1 = "linear-gradient(135deg,#1c2a3a,#4a3f2e)";
    private static final String P2 = "linear-gradient(135deg,#0d2b45,#1f6f8b)";

    private final MemberRepository repo;

    public DataSeeder(MemberRepository repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) {
        if (repo.count() > 0) return;

        Member dwight = member(0, "dwight", "Dwight Ramos", "FULL-STACK DEVELOPER", "Manila, PH",
                "“I build the whole thing, then fuss over the corner radius.”", "#ff6a4d", "OPEN TO AMBITIOUS PROBLEMS",
                "3rd year BSIT student at Pamantasan ng Lungsod ng Maynila, exploring frontend and backend development with React, Spring Boot, Java, and Tailwind.",
                "React", "Spring Boot", "Java");
        dwight.setSlides(new ArrayList<>(List.of(
                new Slide("Coding sessions", "Late nights exploring Java, Spring Boot, and React.", "linear-gradient(160deg,#ff6a4d,#2b2622)"),
                new Slide("Campus life", "3rd year BSIT student at Pamantasan ng Lungsod ng Maynila.", GREEN),
                new Slide("Off the clock", "When I’m not coding, I’m on the court.", BLUE))));

        String soon = "Portfolio coming soon. Replace this text with your story.";
        repo.saveAll(List.of(
                dwight,
                member(1, "m2", "Member Two", "UI/UX DESIGNER", "Quezon City, PH", "“Making complicated tools feel suspiciously simple.”", "#e9b93c", "FLUENT IN FIGMA", soon, "Figma", "Research", "Systems"),
                member(2, "m3", "Member Three", "FRONTEND DEVELOPER", "Manila, PH", "“Pixels are a love language.”", "#7fb2e8", "COFFEE-POWERED", soon, "React", "Tailwind", "A11y"),
                member(3, "m4", "Member Four", "BACKEND DEVELOPER", "Makati, PH", "“If it scales quietly, I did my job.”", "#7cc99a", "BUILDS IN PUBLIC", soon, "Java", "APIs", "SQL"),
                member(4, "m5", "Member Five", "PRODUCT DESIGNER", "Pasig, PH", "“Good defaults beat good settings.”", "#b49cf0", "SKETCHES FIRST", soon, "Prototyping", "UX", "Brand"),
                member(5, "m6", "Member Six", "FULL-STACK DEVELOPER", "Manila, PH", "“Ship it, then make it pretty. Then ship again.”", "#f29bb6", "SHIPS ON FRIDAYS", soon, "Node", "React", "Postgres"),
                member(6, "m7", "Member Seven", "QA ENGINEER", "Taguig, PH", "“I break things so you don’t have to.”", "#3fb0a6", "BREAKS THINGS ON PURPOSE", soon, "Testing", "Automation", "CI"),
                member(7, "m8", "Member Eight", "MOBILE DEVELOPER", "Manila, PH", "“Thumb-friendly or bust.”", "#ffa24d", "MOBILE FIRST", soon, "Flutter", "Kotlin", "UI")
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
                new Slide("Campus life", "Life between classes.", GREEN),
                new Slide("Off the clock", "What I do for fun.", BLUE))));
        return m;
    }
}
