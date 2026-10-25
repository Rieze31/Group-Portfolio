package com.ctpr.club;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class Project {
    private String title;
    @Column(length = 500)
    private String description;
    private String gradient;

    public Project() {}
    public Project(String title, String description, String gradient) {
        this.title = title;
        this.description = description;
        this.gradient = gradient;
    }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getGradient() { return gradient; }
    public void setGradient(String gradient) { this.gradient = gradient; }
}
