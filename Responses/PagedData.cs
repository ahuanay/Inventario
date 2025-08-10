namespace InventarioApi.Responses
{
    public class PagedData<T>
    {
        public int Total { get; set; }

        public int From { get; set; }

        public int Size { get; set; }

        public IEnumerable<T> Rows { get; set; } = new List<T>();
    }
}