using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BookstoreContext _context;

    public BooksController(BookstoreContext context)
    {
        _context = context;
    }

    // GET: api/books?page=1&pageSize=5&sortBy=title&category=Biography
    [HttpGet]
    public async Task<IActionResult> GetBooks(
        int page = 1,
        int pageSize = 5,
        string? sortBy = null,
        string? sortOrder = "asc",
        string? category = null)
    {
        var query = _context.Books.AsQueryable();

        // Category filtering
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Category == category);
        }

        // Sorting
        if (sortBy?.ToLower() == "title")
        {
            query = sortOrder?.ToLower() == "desc"
                ? query.OrderByDescending(b => b.Title)
                : query.OrderBy(b => b.Title);
        }
        else
        {
            query = query.OrderBy(b => b.BookID);
        }

        var totalCount = await query.CountAsync();

        var books = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new { books, totalCount });
    }

    // GET: api/books/categories
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(categories);
    }

    // POST: api/books
    [HttpPost]
    public async Task<IActionResult> AddBook([FromBody] Book book)
    {
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return Ok(book);
    }

    // PUT: api/books/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromBody] Book book)
    {
        var existing = await _context.Books.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Title = book.Title;
        existing.Author = book.Author;
        existing.Publisher = book.Publisher;
        existing.ISBN = book.ISBN;
        existing.Classification = book.Classification;
        existing.Category = book.Category;
        existing.PageCount = book.PageCount;
        existing.Price = book.Price;

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    // DELETE: api/books/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();

        _context.Books.Remove(book);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
