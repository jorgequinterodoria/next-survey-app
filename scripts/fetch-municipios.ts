import fs from 'fs';
import path from 'path';

// Definimos la interfaz de lo que esperamos de la API externa
interface ApiDepartment {
    id: number;
    name: string;
}

interface ApiCity {
    name: string;
}

// Definimos nuestra estructura final
interface MunicipioData {
    muni: string;
    depto: string;
}

async function generateMunicipiosJson(): Promise<void> {
    console.log("🚀 Iniciando descarga de municipios...");

    try {
        const deptoRes = await fetch("https://api-colombia.com/api/v1/Department");
        const departamentos: ApiDepartment[] = await deptoRes.json();

        const dbFinal: MunicipioData[] = [];

        for (const depto of departamentos) {
            console.log(`  Procesando: ${depto.name}...`);

            try {
                const cityRes = await fetch(`https://api-colombia.com/api/v1/Department/${depto.id}/cities`);
                const ciudades: ApiCity[] = await cityRes.json();

                const mapeado: MunicipioData[] = ciudades.map(c => ({
                    muni: c.name,
                    depto: depto.name
                }));

                dbFinal.push(...mapeado);
            } catch (err) {
                console.error(`❌ Error en ${depto.name}:`, err);
            }
        }

        // Ordenar alfabéticamente
        dbFinal.sort((a, b) => a.muni.localeCompare(b.muni));

        // Ruta de guardado (ajustada a la estructura estándar de Next.js)
        const folderPath = path.join(process.cwd(), 'src', 'data');
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        fs.writeFileSync(
            path.join(folderPath, 'municipios.json'),
            JSON.stringify(dbFinal, null, 2)
        );

        console.log(`\n✨ ¡Listo! ${dbFinal.length} municipios guardados.`);
    } catch (error) {
        console.error("🔴 Error crítico:", error);
    }
}

generateMunicipiosJson();