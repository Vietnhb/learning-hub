using System.Collections;
using System.Reflection;
using System.Runtime.Loader;
using System.Text.Json;
using Microsoft.Xna.Framework.Content;
using xTile;

const string GameDir = @"C:\Users\kemin\Downloads\gameDemo";
const string ContentRoot = GameDir + @"\Content";
var mapAssetName = args.FirstOrDefault() ?? "Maps/Farm_Ranching";

AssemblyLoadContext.Default.Resolving += (_, assemblyName) =>
{
    var dllPath = Path.Combine(GameDir, assemblyName.Name + ".dll");
    if (File.Exists(dllPath))
        return Assembly.LoadFrom(dllPath);

    var smapiDllPath = Path.Combine(GameDir, "smapi-internal", assemblyName.Name + ".dll");
    return File.Exists(smapiDllPath) ? Assembly.LoadFrom(smapiDllPath) : null;
};

var outputDir = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "public", "resources", "MLN122", "generated"));
Directory.CreateDirectory(outputDir);

try
{
    using var content = new ContentManager(new EmptyServiceProvider(), ContentRoot);
    var map = content.Load<Map>(mapAssetName);
    var export = ExportMap(map);
    var mapFileName = mapAssetName.Replace("Maps/", "").Replace("/", "-").Replace("\\", "-");
    var jsonPath = Path.Combine(outputDir, $"{mapFileName}-map.json");
    CopyUnpackedMapAssets(export, outputDir);
    File.WriteAllText(jsonPath, JsonSerializer.Serialize(export, new JsonSerializerOptions { WriteIndented = true }));

    Console.WriteLine($"Loaded {mapAssetName}");
    Console.WriteLine($"Map: {export.TileWidth}x{export.TileHeight} tiles / {export.PixelWidth}x{export.PixelHeight}px, {export.Layers.Count} layers, {export.TileSheets.Count} tilesheets");
    foreach (var layer in export.Layers)
        Console.WriteLine($"Layer {layer.Id}: {layer.Width}x{layer.Height}, non-empty {layer.NonEmptyTileCount}");
    Console.WriteLine(jsonPath);
}
catch (Exception ex)
{
    Console.Error.WriteLine(ex.ToString());
    Environment.ExitCode = 1;
}

static MapExport ExportMap(Map map)
{
    var firstLayer = Enumerate(ReadMember(map, "Layers")).FirstOrDefault();
    var tileWidth = firstLayer is null ? 0 : ReadInt(firstLayer, "LayerWidth");
    var tileHeight = firstLayer is null ? 0 : ReadInt(firstLayer, "LayerHeight");

    var export = new MapExport
    {
        TileWidth = tileWidth,
        TileHeight = tileHeight,
        PixelWidth = ReadInt(map, "DisplayWidth"),
        PixelHeight = ReadInt(map, "DisplayHeight"),
    };

    foreach (var tileSheet in Enumerate(ReadMember(map, "TileSheets")))
    {
        export.TileSheets.Add(new TileSheetExport
        {
            Id = ReadString(tileSheet, "Id"),
            ImageSource = ReadString(tileSheet, "ImageSource"),
            SheetWidth = ReadInt(tileSheet, "SheetWidth"),
            SheetHeight = ReadInt(tileSheet, "SheetHeight"),
            TileWidth = ReadInt(tileSheet, "TileWidth"),
            TileHeight = ReadInt(tileSheet, "TileHeight"),
        });
    }

    foreach (var layer in Enumerate(ReadMember(map, "Layers")))
    {
        var width = ReadInt(layer, "LayerWidth");
        var height = ReadInt(layer, "LayerHeight");
        var layerExport = new LayerExport
        {
            Id = ReadString(layer, "Id"),
            Width = width,
            Height = height,
        };

        for (var y = 0; y < height; y++)
        {
            var row = new List<TileExport?>();
            for (var x = 0; x < width; x++)
            {
                var tile = GetTile(layer, x, y);
                if (tile is null)
                {
                    row.Add(null);
                    continue;
                }

                var tileSheet = ReadMember(tile, "TileSheet");
                var tileExport = new TileExport
                {
                    Index = ReadInt(tile, "TileIndex"),
                    Sheet = ReadString(tileSheet, "Id"),
                };
                row.Add(tileExport);
                layerExport.NonEmptyTileCount++;
            }
            layerExport.Tiles.Add(row);
        }

        export.Layers.Add(layerExport);
    }

    return export;
}

static void CopyUnpackedMapAssets(MapExport export, string outputDir)
{
    var unpackedMapsDir = Path.Combine(GameDir, "Content (unpacked)", "Maps");
    var tmxSource = Path.Combine(unpackedMapsDir, "Farm_Ranching.tmx");
    if (File.Exists(tmxSource))
        File.Copy(tmxSource, Path.Combine(outputDir, "Farm_Ranching.tmx"), overwrite: true);

    foreach (var tileSheet in export.TileSheets)
    {
        var assetName = tileSheet.ImageSource.Replace('\\', '/');
        var outputName = assetName.Replace("/", "__") + ".png";
        var outputPath = Path.Combine(outputDir, outputName);
        var sourcePath = Path.Combine(GameDir, "Content (unpacked)", assetName.Replace('/', Path.DirectorySeparatorChar) + ".png");
        if (File.Exists(sourcePath))
            File.Copy(sourcePath, outputPath, overwrite: true);
        else if (!File.Exists(outputPath))
            continue;

        tileSheet.Png = "/resources/MLN122/generated/" + outputName;
    }
}

static object? GetTile(object layer, int x, int y)
{
    var tiles = ReadMember(layer, "Tiles");
    if (tiles is Array array)
        return array.GetValue(x, y);

    var indexer = tiles?.GetType().GetProperty("Item", new[] { typeof(int), typeof(int) });
    return indexer?.GetValue(tiles, new object[] { x, y });
}

static object? ReadMember(object? obj, string name)
{
    if (obj is null)
        return null;

    var type = obj.GetType();
    return type.GetProperty(name, BindingFlags.Instance | BindingFlags.Public)?.GetValue(obj)
        ?? type.GetField(name, BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)?.GetValue(obj);
}

static int ReadInt(object? obj, string name)
{
    var value = ReadMember(obj, name);
    return value is null ? 0 : Convert.ToInt32(value);
}

static string ReadString(object? obj, string name)
{
    return Convert.ToString(ReadMember(obj, name)) ?? "";
}

static IEnumerable<object> Enumerate(object? value)
{
    if (value is IEnumerable enumerable)
    {
        foreach (var item in enumerable)
        {
            if (item is not null)
                yield return item;
        }
    }
}

sealed class EmptyServiceProvider : IServiceProvider
{
    public object? GetService(Type serviceType) => null;
}

sealed class MapExport
{
    public int TileWidth { get; set; }
    public int TileHeight { get; set; }
    public int PixelWidth { get; set; }
    public int PixelHeight { get; set; }
    public List<TileSheetExport> TileSheets { get; set; } = [];
    public List<LayerExport> Layers { get; set; } = [];
}

sealed class TileSheetExport
{
    public string Id { get; set; } = "";
    public string ImageSource { get; set; } = "";
    public int SheetWidth { get; set; }
    public int SheetHeight { get; set; }
    public int TileWidth { get; set; }
    public int TileHeight { get; set; }
    public int PixelWidth { get; set; }
    public int PixelHeight { get; set; }
    public string Png { get; set; } = "";
}

sealed class LayerExport
{
    public string Id { get; set; } = "";
    public int Width { get; set; }
    public int Height { get; set; }
    public int NonEmptyTileCount { get; set; }
    public List<List<TileExport?>> Tiles { get; set; } = [];
}

sealed class TileExport
{
    public string Sheet { get; set; } = "";
    public int Index { get; set; }
}
