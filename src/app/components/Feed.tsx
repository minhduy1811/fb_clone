import LeftSidebar from "./LeftSidebar";
import NewPost from "./NewPost";
import Stories from "./Stories";
import Post from "./Post";
import RightSidebar from "./Post"

const Feed = () => {
    return (
        <main className="mt-12 flex bg-gray-100 min-h-screen overflow-x-hidden">
            {/* Cột trái */}
            <aside className="hidden lg:block w-1/4">
                <div className="sticky  overflow-y-auto scrollbar-hover">
                    <LeftSidebar />
                </div>
            </aside>

            {/* Cột giữa (chính) */}
            <section className="flex-1 max-w-[600px] mx-auto p-4">
                <div>
                    {/* CreatePost */}
                    <div className="mb-4 bg-white p-4 rounded-lg shadow">
                        <NewPost />
                    </div>

                    {/* Stories */}
                    <div>
                        <Stories />
                    </div>

                    {/* Các bài post */}
                    <div className="space-y-4">
                        <div className="bg-white px-2 pt-2 pb-0 rounded-lg shadow">
                            <Post />
                        </div>
                    </div>
                </div>
            </section>

            {/* Cột phải */}
            <aside className="hidden lg:block w-1/4">
                <div className="sticky overflow-y-auto scrollbar-hover">
                    <RightSidebar />
                </div>
            </aside>
        </main>


    )
}

export default Feed;