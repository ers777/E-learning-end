using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebApplication2.Models;
using System.Threading.Tasks;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using System.Xml.Linq;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using static System.Net.Mime.MediaTypeNames;



namespace WebApplication2.Controllers
{

    public class HomeController : Controller
    {   
        static GraphQLHttpClient graphQLClient = new GraphQLHttpClient("https://api-us-east-1-shared-usea1-02.hygraph.com/v2/clq7yqm9f9kwb01um0lix6ww0/master", new NewtonsoftJsonSerializer());
        static List<CourseViewModel>  coursesList = new List<CourseViewModel>();

        private readonly ILogger<HomeController> _logger;


        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public async Task<IActionResult> IndexAsync()
        {
            //var graphQLClient = new GraphQLHttpClient("https://api-us-east-1-shared-usea1-02.hygraph.com/v2/clq7yqm9f9kwb01um0lix6ww0/master", new NewtonsoftJsonSerializer());

            // Create the query
            var query = new GraphQLHttpRequest
            {

                Query = @"query MyQuery {
                      courses {

                        author
                        level
                        name
                        price
                        time
                        banner {
                          url
                        }
                        description {
                          markdown
                        }
                        chapter {
                        content {
                          heading
                          description {
                            markdown
                            html
                          }
                          output{
                            markdown
                            html
                          }
                        }
                           title
                           id
                        }
                        test {
                              ansswer

                              question
                              rightAnw
                            }
                        lab {
                              url
                            }
                        tags
                        id_c
                        id
                      }
                    }

                    "
            };

            // Send the query to fetch the data
            var response = await graphQLClient.SendQueryAsync<dynamic>(query);

            // Extract courses from the response
            var coursesData = response.Data["courses"];


            // Convert data into CourseViewModel objects
            foreach (var course in coursesData)
            {
                var imgUrl = "";
                var lab = "";
                if (course["banner"] != null && course["banner"]["url"] != null)
                {
                    imgUrl = course["banner"]["url"].ToString();
                }
                List<string> labUrls = new List<string>();

                // ѕроверить, что "lab" содержит массив URL-адресов
                if (course["lab"] != null && course["lab"] is JArray)
                {
                    JArray labArray = (JArray)course["lab"];

                    // ѕройти по всем элементам массива и добавить URL-адреса в список
                    foreach (var labItem in labArray)
                    {
                        if (labItem["url"] != null)
                        {
                            labUrls.Add(labItem["url"].ToString());
                        }
                    }
                }


                var chaptersList = new List<Chapter>();
                if (course["chapter"] != null)
                {
                    foreach (var chapterData in course["chapter"])
                    {
                        var contentItems = new List<ContentItem>();
                        foreach (var contentData in chapterData["content"])
                        {
                            var description = new Description
                            {
                                Markdown = contentData["description"]?["markdown"]?.ToString(),
                                Html = contentData["description"]?["html"]?.ToString()
                            };

                            Output output = null;
                            if (contentData["output"] != null && contentData["output"].Type != JTokenType.Null)
                            {
                                // Checking if the output properties exist and are not null
                                var markdown = contentData["output"]["markdown"];
                                var html = contentData["output"]["html"];
                                if (markdown != null && html != null)
                                {
                                    output = new Output
                                    {
                                        Markdown = markdown.ToString(),
                                        Html = html.ToString()
                                    };
                                }
                            }


                            var contentItem = new ContentItem
                            {
                                Heading = contentData["heading"]?.ToString(),
                                Description = description,
                                Output = output  // Assume output has similar structure to description
                            };
                            contentItems.Add(contentItem);
                        }

                        var chapter = new Chapter
                        {
                            Content = contentItems,

                        };
                        chaptersList.Add(chapter);
                    }
                }
                var testList = new List<Test>();

                foreach (var testItem in course["test"]) // перебор всех элементов массива "test"
                {

                    var test = new Test
                    {
                        Ansswer = ((JArray)testItem["ansswer"]).ToObject<List<string>>(), // список ответов
                        Question = testItem["question"].ToString(), // текст вопроса
                        RightAnw = testItem["rightAnw"].ToString(),
                    };

                    testList.Add(test);
                }

                var courseViewModel = new CourseViewModel
                {
                    Author = course["author"].ToString(),
                    Name = course["name"].ToString(),
                    Level = course["level"].ToString(),
                    Price = int.Parse(course["price"].ToString()),
                    Time = course["time"].ToString(),
                    Img = imgUrl,
                    Description = course["description"]["markdown"].ToString(),
                    Tags = course["tags"].ToString(),
                    Id = course["id"].ToString(),
                    Chapters = chaptersList,
                    Test = testList,
                    Lab = labUrls

                };

                coursesList.Add(courseViewModel);
            }

            ViewBag.Courses = coursesList;


            return View();
        }


        public IActionResult Privacy(string courseId)
        {
            var course = coursesList.FirstOrDefault(c => c.Id == courseId);

            // ≈сли курс не найден, вернуть NotFound
            if (course == null)
            {
                return NotFound();
            }

            // ѕередать курс в представление
            return View(course);
        }



        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
