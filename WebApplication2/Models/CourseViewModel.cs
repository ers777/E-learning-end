namespace WebApplication2.Models
{
    public class Chapter
    {
        public List<ContentItem> Content { get; set; }
        public string Title { get; set; }
        public string Id { get; set; }
    }

    public class ContentItem
    {
        public string Heading { get; set; }
        public Description Description { get; set; }
        public Output Output { get; set; }
    }
    public class Description
    {
        public string Markdown { get; set; }
        public string Html { get; set; }
    }
    public class Output
    {
        public string Markdown { get; set; }
        public string Html { get; set; }
    }

    public class Test
    {
        public List<string> Ansswer { get; set; } // List of answers
        public string Question { get; set; } // Question text
        public string RightAnw { get; set; } // Correct answer
    }



    public class CourseViewModel
    {
        public string Author { get; set; }

        public string Level { get; set; }

        public string Name { get; set; }
        public int Price { get; set; }

        public string Description { get; set; }

        public string Time { get; set; }

        public string Img { get; set; }
        public string Tags { get; set; }
        public List<Chapter> Chapters { get; set; } // Добавляем свойство Chapters

        public string Id { get; set; }
        public List<string> Lab { get; set; }
        public List<Test> Test { get; set; }

    }
}

