const testData = {
  user: {
    username: "pss",
    name: "Parsa",
    password: "12345678",
  },

  blog: {
    title: "example blog entry",
    author: "Parsa",
    url: "https://google.com",
  },
};

describe("Blog application", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    cy.request("POST", "http://localhost:3003/api/users/", testData.user);
    cy.visit("http://localhost:3003");
  });

  it("Login form is visible", function () {
    cy.get("body").should("contain", "log in");
  });

  describe("User authentication", function () {
    it("User can login with valid credentials", function () {
      cy.get("body").contains("log in").click();
      cy.get(".username").type(testData.user.username);
      cy.get(".password").type(testData.user.password);
      cy.get("body").contains("login").click();
      cy.get("body").contains("logout").click();
    });

    it("Login fails with invalid credentials", function () {
      cy.get("body").contains("log in").click();
      cy.get(".username").type(testData.user.username);
      cy.get(".password").type("wrongpass");
      cy.get("body").contains("login").click();
      cy.get("body").should("contain", "login");
    });
  });

  describe("Blog operations", function () {
    beforeEach(function () {
      cy.get("body").contains("log in").click();
      cy.get(".username").type(testData.user.username);
      cy.get(".password").type(testData.user.password);
      cy.get("body").contains("login").click();

      cy.get(".title").type(testData.blog.title);
      cy.get(".author").type(testData.blog.author);
      cy.get(".url").type(testData.blog.url);
      cy.get("body").contains("create").click();
      cy.get("body").should("contain", testData.blog.title);
    });

    it("User can like a blog", function () {
      cy.get("body").contains("show details").click();
      cy.get("body").contains("like").click();
      cy.get("body").should("contain", "1");
    });

    it("User can delete a blog", function () {
      cy.get("body").contains("show details").click();
      cy.get("body").contains("remove").click();
    });

    describe("Blog ordering", function () {
      const additionalBlogs = [
        { title: "new blog", author: "Rasa", url: "yahoo.com" },
        { title: "final blog", author: "Ali", url: "youtube.com" },
      ];
    
      beforeEach(function () {
        additionalBlogs.forEach((x) => {
          cy.get(".title").first().type(x.title);
          cy.get(".author").first().type(x.author);
          cy.get(".url").first().type(x.url);
          cy.get("body").contains("create").click();
        });
      });
    
      it("Blogs are ordered based on likes", function () {
        cy.get(".blog").eq(0).should("contain", testData.blog.title);
        cy.get(".blog").eq(1).within(() => {
          cy.contains("show details").click();
          cy.contains("like").click();
        });
        cy.get(".blog").eq(0).should("contain", "new blog");
        cy.get(".blog").eq(1).should("contain", testData.blog.title);
      });
    });
    
  });
});
