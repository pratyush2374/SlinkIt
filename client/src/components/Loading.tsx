import { Loader2 } from "lucide-react";

const Loading = () => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="p-8 rounded-lg flex flex-col items-center space-y-6">
                {/* Primary loader */}
                <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                    <div className="absolute -inset-1 rounded-full animate-pulse bg-blue-100 dark:bg-blue-900 -z-10" />
                </div>

                {/* Loading text */}
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                        Loading
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Please wait while we set things up...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Loading;
