/*
 * Clean Minimalistic Template
 * Copyright (c) 2025 Youssef Mohamed Ali
 * Licensed under the MIT License
 * https://github.com/Lina4Life/clean-minimalistic-template
 */
import React, { useState } from 'react';

const courses = [
  {
    title: "Art History Essentials",
    category: "History",
    level: "Beginner",
    duration: "6 weeks",
    desc: "Explore the fundamental movements and periods that shaped art history, from Renaissance to Contemporary.",
    image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66",
    instructor: "Dr. Maria Garcia",
    modules: 12,
    enrolled: 1240,
    rating: 4.8
  },
  {
    title: "Digital Art Mastery",
    category: "Digital",
    level: "Intermediate",
    duration: "8 weeks",
    desc: "Master digital art creation using industry-standard tools and techniques.",
    image: "https://images.unsplash.com/photo-1561998338-13ad7883b21d",
    instructor: "James Wilson",
    modules: 16,
    enrolled: 890,
    rating: 4.9
  },
  {
    title: "Curatorial Practice",
    category: "Professional",
    level: "Advanced",
    duration: "10 weeks",
    desc: "Learn the principles of exhibition curation and gallery management.",
    image: "https://images.unsplash.com/photo-1554907984-15263bfd63bd",
    instructor: "Sarah Chen",
    modules: 20,
    enrolled: 456,
    rating: 4.7
  },
  {
    title: "Photography Fundamentals",
    category: "Photography",
    level: "Beginner",
    duration: "4 weeks",
    desc: "Master the basics of photography, from composition to post-processing.",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d",
    instructor: "David Kim",
    modules: 8,
    enrolled: 2100,
    rating: 4.6
  }
];

const categories = ["All", "History", "Digital", "Photography", "Professional"];

const Learn = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredCourse, setHoveredCourse] = useState(null);

  const filteredCourses = selectedCategory === "All" 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  return (
    <div style={{
      padding: "6rem 2rem",
      background: "linear-gradient(to bottom, #f8f8f8 0%, #fff 100%)"
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "4rem"
        }}>
          <h1 style={{
            fontSize: "3rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            background: "linear-gradient(90deg, #d7263d 0%, #f46036 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Expand Your Art Knowledge
          </h1>
          <p style={{
            fontSize: "1.2rem",
            color: "#666",
            maxWidth: "600px",
            margin: "0 auto 2rem"
          }}>
            Discover our curated collection of art courses and resources
          </p>

          {/* Category Filter */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
            marginTop: "2rem"
          }}>
            {categories.map((category, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: "0.5rem 1.5rem",
                  borderRadius: "25px",
                  border: "none",
                  background: category === selectedCategory ? "#d7263d" : "rgba(215, 38, 61, 0.1)",
                  color: category === selectedCategory ? "#fff" : "#d7263d",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          padding: "1rem"
        }}>
          {filteredCourses.map((course, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredCourse(idx)}
              onMouseLeave={() => setHoveredCourse(null)}
              style={{
                background: "#fff",
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                transform: hoveredCourse === idx ? "translateY(-10px)" : "translateY(0)"
              }}
            >
              {/* Course Image */}
              <div style={{
                position: "relative",
                height: "200px",
                overflow: "hidden"
              }}>
                <img
                  src={course.image}
                  alt={course.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                    transform: hoveredCourse === idx ? "scale(1.05)" : "scale(1)"
                  }}
                />
                <div style={{
                  position: "absolute",
                  top: "1rem",
                  left: "1rem",
                  background: "rgba(0,0,0,0.7)",
                  color: "#fff",
                  padding: "0.4rem 1rem",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  fontWeight: "500"
                }}>
                  {course.level}
                </div>
              </div>

              {/* Course Content */}
              <div style={{ padding: "2rem" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    color: "#d7263d",
                    fontSize: "0.9rem",
                    fontWeight: "500"
                  }}>
                    {course.category}
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#666",
                    fontSize: "0.9rem"
                  }}>
                    ⭐ {course.rating}
                  </div>
                </div>

                <h2 style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                  lineHeight: 1.3
                }}>
                  {course.title}
                </h2>

                <p style={{
                  color: "#666",
                  fontSize: "1rem",
                  lineHeight: 1.6,
                  marginBottom: "1.5rem"
                }}>
                  {course.desc}
                </p>

                <div style={{
                  borderTop: "1px solid #eee",
                  paddingTop: "1.5rem",
                  marginTop: "1.5rem"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      color: "#666",
                      fontSize: "0.9rem"
                    }}>
                      <span style={{ marginRight: "0.5rem" }}>👨‍🏫</span>
                      {course.instructor}
                    </div>
                    <div style={{ color: "#666", fontSize: "0.9rem" }}>
                      {course.duration}
                    </div>
                  </div>

                  <button style={{
                    width: "100%",
                    padding: "1rem",
                    background: "var(--text-primary)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "var(--transition)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--accent-color)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--text-primary)';
                  }}>
                    Enroll Now
                  </button>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "1rem",
                    color: "#666",
                    fontSize: "0.8rem"
                  }}>
                    <span>{course.modules} modules</span>
                    <span>{course.enrolled.toLocaleString()} students enrolled</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learn;
