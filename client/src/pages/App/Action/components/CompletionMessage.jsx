export default function CompletionMessage({ checkedDays }) {
    return (
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-[30px] shadow-lg p-8 text-white text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">¡Acción completada!</h2>
            <p className="text-green-100 mb-4">
                Completaste esta acción {checkedDays.length} {checkedDays.length === 1 ? 'vez' : 'veces'}
            </p>
            <button className="bg-white text-green-600 px-6 py-3 rounded-2xl font-semibold hover:bg-green-50 transition-colors">
                Compartir en comunidad 🌱
            </button>
        </div>
    );
}